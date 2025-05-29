const express = require('express')
const router = express.Router()
const Yup = require('yup')
const validateForm = require('../controllers/validateform')



router.post('/login',(req,res)=>{
    validateForm(req,res)
})

router.post('/register',(req,res)=>{
    validateForm(req,res)
})


module.exports = router // Exporting the router