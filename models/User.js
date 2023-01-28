const mongoose = require('mongoose')
const schema = mongoose.Schema
const {isEmail} = require('validator')
const bcrypt = require("bcrypt")

const UserModel = new schema({
    email:{
        type:String,
        required:[true, 'Please, enter your email!'],
        unique:true,
        lowercase:true,
        validate:[isEmail, 'Please, enter a valid email']
    },
    password:{
        type:String,
        required:[true, 'Please, enter your password! '],
        minlength:[6, 'Your password must be at least 6 characters long!']
    }
})


//hashing the password BEFORE creating the user
UserModel.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword 

    next()
})

//static method to login the user
UserModel.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if(user){//if this user´s email exists
        const auth = bcrypt.compare(password, user.password)
        if(auth){//if this password exists
            return user; //the user can be logged in
        }
        throw Error("incorrect password")//otherwise the password is incorrect
    }

    throw Error("incorrect email")
}

const user = mongoose.model("User", UserModel)
module.exports = user