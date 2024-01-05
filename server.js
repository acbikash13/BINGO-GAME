require('dotenv').config();
const port= process.env.PORT ;
const IP = process.env.IP_ADDRESS ;

const express=require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser =  require('cookie-parser');

//create an express app
const server =  http.createServer(app);

// create an io server
const io =  socketIo(server);

app.use(bodyParser.json());
app.use(express.json())
const auth =  require('./BingoBackend/routes/auth');
const waitingRoom = require('./BingoBackend/routes/waitRoom')
const path = require('path');

app.use(cookieParser());
// serves the static files
app.use(express.static('public'));
// Set the views directory to the correct path
app.set("views", path.join(__dirname, 'public', 'views', 'private'));

// Configure bodyParser middleware and set the ejs engine
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")

//routes
app.use('',auth);
app.use('/game',waitingRoom);


// socket.IO setup

io.on('connection', (socket) => {
    console.log('A user Joined the Game Room');
    socket.on('playerJoined', (data) => {
        // sets the each connection with their unique userId. 
        // create a room for only the 
        socket.join(data.gameId);
        io.to(data.gameId).emit('playerJoined', data);
    });
    socket.on('isReady',(data)=>{
        io.emit('isReady', data);
    });
    socket.on('startGame',(data)=>{
        io.emit('startGame',data);
    })
    socket.on('disconnect',()=> {
        console.log('User left the game room!');
    });
});




server.listen(port,()=>{
    console.log(`Server started at ${port}`)
});


