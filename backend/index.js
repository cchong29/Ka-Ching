const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./router/router')

const app =express()

app.use(bodyParser.json()) // Parsing our bodies for forums, accepting it as JSON data to process it
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
    origin : '*',
    credentials : 'true',
    optionSuccessStatus : 200,
}
app.use(cors(corsOptions))
app.use('/',router) // This router must be after everything (bodyparser and options)

const port = 4000
const server = app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})