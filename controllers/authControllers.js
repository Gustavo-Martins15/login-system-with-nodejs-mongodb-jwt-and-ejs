//importing user model
const User = require("../models/User")
//importing jwt
const jwt = require('jsonwebtoken')

//handling errors
const handleErrors = (err)=>{
    console.log(err.message, err.code)

    let errors = {email:'', password:''}

    if(err.message == 'incorrect email'){
        errors.email = "this email is not registered."
    }

    if(err.message == 'incorrect password'){
        errors.password = "this password is incorrect."
    }

    if(err.code == 11000){
        errors.email = "This email is already registered"
        return errors
    }

    if(err.message.includes("User validation failed")){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }

    return errors

}

const maxAge = 3 * 24 * 60 * 60
//separated jwt function
const createToken = (id)=>{
    return token = jwt.sign({ id },process.env.JWT_SECRET)
}

module.exports.register_get = (req,res)=>{
    res.render('register')
}

module.exports.register_post = async(req,res)=>{
    const {email, password} = req.body

    try {
        const user = await User.create({email, password})
        const token =createToken(user._id)
        res.cookie('jwt', token, {httpOnly:true})
        res.status(201).json(user)
        console.log(token)
    } catch (err) {
        //if(error) res.status(500).json({error: "User not created", message: error.message})
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

module.exports.login_get = (req,res)=>{
    res.render('login')
}

module.exports.login_post = async(req,res)=>{
    const {email, password} = req.body
    try {
        const user = await User.login(email, password)//using mongoose statics method
        const token =createToken(user._id)
        res.cookie('jwt', token, {httpOnly:true})
        res.status(200).json({user: user._id})
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
}

module.exports.logout_get = async (req,res)=>{
    res.cookie("jwt", '/',{maxAge:1})
    res.redirect('/')
}