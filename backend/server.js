// This file serves as the entry point for the Node.js application.

// Work in Progress, taking reference from this vid: https://www.youtube.com/watch?v=RHLxtAo0aEI

// Importing express module 
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Handling GET / request 
app.use("/", (req, res, next) => { 
    res.send("express server"); 
}) 

// Handling GET /hello request 
app.get("/hello", (req, res, next) => { 
    res.send("hello response"); 
}) 

// Server setup 
app.listen(3000, () => { 
    console.log("Server is Running"); 
})