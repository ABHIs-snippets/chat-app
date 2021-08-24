// get user name from url
let username = (window.location.search).split('=')[1]
document.getElementsByTagName('h3')[0].innerText = username


// create socket function
let socket = io()

let chatBody = document.getElementById('chatBody');
let msgInput = document.getElementById('MsgInput');

// get msg from server
socket.on('msg',(data)=>{
appendMsg(data,1)
hideTypeMsg()
})

// get typing event from server
socket.on('typing',(data)=>{
    showTypeMsg(data);
    deBounce(hideTypeMsg,1000);
})

// debounce function for typing event
let isStillTyping = null;
function deBounce(func,time){
    if(isStillTyping) clearTimeout(isStillTyping);
   isStillTyping = setTimeout(func,time)
}

// emit typing event on keyup
msgInput.addEventListener('keyup',()=>{
    socket.emit('typing',username);
})


// send msg to server
document.getElementById('msgForm').addEventListener('submit',(e)=>{
    e.preventDefault()
socket.emit('msg',{name:username,msg:msgInput.value});
appendMsg({msg:msgInput.value,name:'You'},0);
msgInput.value = ''
})


// append msg to dom
function appendMsg(msg,isUser){
let msgDiv = document.createElement('div');
msgDiv.classList.add('msg',isUser?'user':'self');
msgDiv.innerText = msg.msg;
let nameElem = document.createElement('small');
nameElem.innerText = msg.name;
msgDiv.prepend(nameElem);
chatBody.append(msgDiv);
msgDiv.scrollIntoView()
}

// show typing msg
function showTypeMsg(msg){
    let typeElem = document.querySelector('.typing');
    let nameElem = document.querySelector('.typing>small');
    nameElem.innerText = msg || 'Someone';
    typeElem.prepend(nameElem);
    typeElem.style.display = 'block';
}

// hide typing msg
function hideTypeMsg(){
    let typeElem = document.querySelector('.typing');
    let nameElem = document.querySelector('.typing>small');
    nameElem.innerText = '';
    typeElem.prepend(nameElem);
    typeElem.style.display = 'none';
}