
//OpenAI API KEY: Add your personal OpenAI API key inside the quotes 
var key = " "





//OpenAI Authentication
var auth = `Bearer ${key}`
var url = "https://api.openai.com/v1/chat/completions"
var aimodel = "gpt-4-0125-preview";

//messages to store the ChatGPT roles and content
var messages = [];

//Enter the prompt
var promptField = document.querySelector("#prompt");
var prompt;
var submit = document.querySelector("#submitbtn");

//Button to download the chat
var downloadBtn = document.querySelector("#download")

//Chat display area
var replies = document.querySelector("#replies");

//Waiting on response notification
var waiting = document.querySelector("#waiting");


//Send prompt to the API 
submit.addEventListener("click", function() {
    waiting.classList.remove("hide");
    waiting.classList.add("pulsing")
    
    //Get the prompt
    prompt = promptField.value;

    //Display each prompt question
    var promptEl = document.createElement("h3");
    promptEl.innerHTML = prompt
    promptEl.classList.add("question")
    replies.appendChild(promptEl);

    //Add the user role and prompt to the messages array
    messages.push({"role": "user", "content": prompt})

    //Disable input field and button so no other requests can be submitted while waiting
    promptField.disabled = true;
    submit.disabled = true;
    downloadBtn.disabled = true;

    //Required data to be sent in the request body
    var data = JSON.stringify({
        model: aimodel,
        messages: messages,
    })

    //Request options
    var options = {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json', 
            'Authorization': auth
        },
        body: data,
    }
    

    fetch(url, options)
    .then(resp => resp.json())
    .then(respData => {
        var answer = respData.choices[0].message.content
        messages.push({"role": "assistant", "content": answer}) 

        //Parse markdown response to display on page
        var parseMd = marked.parse(answer)
        
        waiting.classList.add("hide");
        waiting.classList.remove("pulsing");

        //Enable input field and button and download button
        promptField.disabled = false;
        promptField.value = "";
        submit.disabled = false;
        downloadBtn.disabled = false

        //Display responses
        var ansEl = document.createElement("h2");
        ansEl.innerHTML = parseMd;
        replies.appendChild(ansEl);
        var h2s = document.querySelectorAll('h2');
        
        for(var i=0;i<h2s.length;i++) {
            h2s[i].classList.remove("newest")
        }

        var last = h2s.length - 1;
        h2s[last].classList.add("newest");
        hljs.highlightAll();
        h2s[last].scrollIntoView();

    })

})

//Download chat as a pdf
var pdfOptions = {
	filename: 'my-ai.pdf',
	margin: 1,
	image: { type: 'jpeg', quality: 0.98 },
	html2canvas: { scale: 2 },
	jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
};

downloadBtn.addEventListener("click", () => {
    html2pdf().set(pdfOptions).from(replies).save();
})