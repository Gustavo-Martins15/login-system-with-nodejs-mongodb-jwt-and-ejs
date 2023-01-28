const jwt = require('jsonwebtoken')
const User = require('../models/User')

//jwt middleware to protect any routes
const authRequired = (req,res,next)=>{
    const token = req.cookies.jwt
    //checking if token exists
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect("/auth/login")
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/auth/login')
    }
}

//check the current user
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                console.log(decodedToken)
                const user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }

}

module.exports = {authRequired, checkUser}