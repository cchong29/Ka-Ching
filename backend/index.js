// const express = require('express')
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const router = require('./router/router')

// const app =express()

// app.use(bodyParser.json()) // Parsing our bodies for forums, accepting it as JSON data to process it
// app.use(bodyParser.urlencoded({extended:false}))

// const corsOptions = {
//     origin : '*',
//     credentials : 'true',
//     optionSuccessStatus : 200,
// }
// app.use(cors(corsOptions))
// app.use('/',router) // This router must be after everything (bodyparser and options)



// const port = process.env.PORT || 4000
// const server = app.listen(port,()=>{
//     console.log(`Server is running on ${port}`)
// })




// Filename - index.js

// Entry Point of the API Server 
// const express = require('express');

/* Creates an Express application. 
   The express() function is a top-level 
   function exported by the express module.
*/
// const app = express();


/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
// const bodyParser = require('body-parser');
// app.use(bodyParser.json())// Parsing our bodies for forums, accepting it as JSON data to process it
// app.use(bodyParser.urlencoded({ extended: false }));



// app.get('/testdata', (req, res, next) => {
//     console.log("TEST DATA :");
//     pool.query('Select * from test')
//         .then(testData => {
//             console.log(testData);
//             res.send(testData.rows);
//         })
// })

// Require the Routes API  
// Create a Server and run it on the port 4000
// const server = app.listen(4000, function () {
//     let host = server.address().address
//     let port = server.address().port
//     // Starting the Server at the port 4000
// })




const express = require('express')
const {Server} = require('socket.io');
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const authrouter = require('./routes/authrouter')
const session = require("express-session");

const server = require("http").createServer(app);

// load env variables into this file
require("dotenv").config()

const io = new Server(server,{
    cors:{
        origin : 'http://192.168.68.108:8081',
        credentials : 'true',

    }
})


app.use(helmet())
app.use(cors({
        origin : 'http://192.168.68.108:8081',
        credentials : 'true',
        optionSuccessStatus : 200,
    }))

app.use(express.json()) // receive JSON and treat it like javascript obj
app.use(
    session({
        secret : process.env.COOKIE_SECRET,
        credentials : true,
        name : "sid",
        resave : false, // doesn't save the session for no reason, only saves if sth changes
        saveUninitialized : false,
        cookie : {
            secure : process.env.ENVIRONMENT === "production" ? "true" : "auto",
            httpOnly : true,
            sameSite : process.env.ENVIRONMENT === "production"? "none" : "lax",
        }
    })
)
app.use('/auth',authrouter)

app.get('/',(req,res)=>{
    res.json('hi')
})

io.on('connect',socket =>{})

server.listen(4000,()=>{
    console.log('Server listening on port 4000')
})