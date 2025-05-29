const Yup = require('yup');

const formSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
})

const validateForm = (req,res)=>{
    const formData = req.body
    formSchema.validate(formData).catch(err=>{
        res.status(422).send()
        console.log(err.errors)
    }).then(valid=> {if (valid){console.log('form is good')}})
}

module.exports = validateForm