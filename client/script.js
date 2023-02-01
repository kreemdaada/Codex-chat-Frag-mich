import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//load Masseges and render '...'
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContext === '....') {
      element.textContent = '';
    }
  }, 300)
}

//Um schreiben zu können
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)

}

//generate Unique random Id 
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const haxadecimlString = randomNumber.toString(16);

  return `id-${timestamp}-${haxadecimlString}`;
}

//emplement chatStripe
function chatStripe (isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class ="chat">
       <div calss = "profile">
        <img 
           src = "${isAi ? bot : user}"
           alt = "${isAi ? 'bot' : 'user'}"
         />
       </div>
       <div class = "message" id= ${uniqueId}>${value}</div>
      </div>
    </div>
  `
  )

}

//handel submit function to be trager to get ai genereter response

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //users chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ",uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);



  // fetch data from server -> bot response
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim();

    //console.log({parsedData})


    typeText(messageDiv, parseData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Etwas schief gelaufen";
    alert(err);
  }
}
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
