require('dotenv').config();
const port= process.env.PORT ;
const IP = process.env.IP_ADDRESS ;

const express=require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser =  require('cookie-parser');

app.use(bodyParser.json());
app.use(express.json())
const checkUser  = require('./BingoBackend/middleware/checkUser');
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

app.use('',auth);
app.use('/game',waitingRoom)

app.listen(port,()=>{
    console.log(`Server started at ${port}`)
});


