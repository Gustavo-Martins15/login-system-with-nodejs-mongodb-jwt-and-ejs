//importing modules
require("dotenv").config()
const express = require('express')
const app = express()
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {authRequired, checkUser} = require('./authMiddleware/authMiddleware')//jwt middleware to protect routes
//routes
const authRoutes = require('./routes/authRoutes')


//middlewares
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'*',
    credentials:true
}))
app.use('/auth', authRoutes)
app.use('*', checkUser)



//database connection 
mongoose.connect(process.env.dbURI,()=>console.log("db connected"))

// view engine
app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render('home')
})

app.get("/smoothies", authRequired,(req,res)=>{
    res.render('smoothies')
})

app.listen(3000, ()=>{
    console.log('server working!')
})