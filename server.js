const express = require('express');
const app = express();


// parse incoming request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))


// chat internface
app.use('/chat',express.static('public'))


// root page with webcome msg
app.get('/',(req,res)=>{
    res.send(welcomePage())
})

// create user post
app.post('/create-user',(req,res)=>{
    let user = req.body;
    console.log(user)
    // redirect to chat page with append username in url as query params
    res.redirect(`/chat?username=${user.username}`) 
})

// return welcome msg to root page
function welcomePage(){
    return `
    <h1>Welcome to Live world</h1>
    <h4>User list</h4>
    <ul>
    <li>Abhishek Shivhare</li>
    <li>Abhinav Gupta</li>
    <li>Abhishek Patel</li>
    </ul>
    <form method="post" action="/create-user">
    <label for="usernameInput">Join chat room , Enter your name</label><br>
    <input id="usernameInput" name="username" />
    <button type="submit">Join</button>
    </form>
    `
}


const PORT = process.env.PORT || 3000;


// listen server on given port
const server = app.listen(PORT,()=>{
    console.log(`server is running on port : ${PORT}`)
})

// require io function
let io = require('socket.io')(server);


// event when user connect to server
io.on('connection',(socket)=>{
    console.log(`socket id:`,socket.id)

    // listen msg event from browser and emit to all connected browser
    socket.on('msg',(data)=>{
        socket.broadcast.emit('msg',data);
    })

    // listen typing event and broadcast 
    socket.on('typing',(name)=>{
        socket.broadcast.emit('typing',name);
    })
})
