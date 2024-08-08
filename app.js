const express=require('express')
const app=express()
const connectDB=require("./db/connect.js")
require('dotenv').config()
const port=3000
const path=require('path')
const route1=require("./routes/routes1.js")
const MongoStore=require('connect-mongo')
// const {initializingPassport} = require('./config/passport-setup-local.js')
const local_auth_routes=require("./routes/local_auth_routes.js")
const auth_routes=require("./routes/auth_routes.js")
const google_admin=require("./routes/google_admin.js")
const admin_local_auth=require("./routes/admin_local_auth.js")
const plant_routes=require("./routes/plant_routes.js")
const cart=require("./routes/cart.js")
const nursery_input=require("./routes/nursery.js")
const order=require("./routes/order.js")
// const passportSetup=require('./config/passport-setup.js')
const cookieSession=require('cookie-session')
const passport=require('passport')
const expressSession=require('express-session')
const keys=require('./config/keys.js')
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/index',express.static(__dirname+'/index'))
// require("./config/passport-setup.js")
// require("./config/passport-setup-local.js")
require("./config/passport_set.js")
app.set('view engine','ejs')


// initializingPassport(passport);
app.use(expressSession({
    secret: 'your-secret-key',
    saveUninitialized: true,
    resave: true,
    store:MongoStore.create({mongoUrl:process.env.MONGO_URI,collectionName:'sessions'}),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 7 days
        // httpOnly: false,
    },
}));
app.use(passport.initialize())
app.use(passport.session())
app.use('/',local_auth_routes);
app.use('/adminlogin',admin_local_auth)

app.use('/auth',auth_routes)
app.use('/order',order)
app.use('/admin/auth',google_admin)
app.use('/admin/dashboard',nursery_input)
app.get('/',(req,res)=>{
    if(req.isAuthenticated()){

        res.sendFile(path.join(__dirname,"./index/index.html"))
    }
    else{
        res.redirect("/login")
    }
})
app.get('/senduser',(req,res)=>{
    if(req.isAuthenticated()){
        console.log(req.user)
        res.json(req.user);
    }
    else{
        res.redirect("/login")
    }
})

app.use('/',plant_routes)
app.use('/cart',cart);
//admin page
app.get('/admin',(req,res)=>{
    if(req.isAuthenticated()){
        
        app.use(express.static(__dirname+'/admin'))
        res.sendFile(path.join(__dirname,"./admin/index.html"))
    }
    else{
        res.redirect("/login")
    }
})
//view all

//view one
app.get('/data2',(req,res)=>{
    
        res.sendFile(path.join(__dirname,"./index/productdetaill.html"))
   
})
app.use('/admin',plant_routes)
//routes for admin page and user handling
// app.use('/admin',route1);
const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.Port||port,()=>{
            console.log("server is running...")
        })
    } catch (error) {
        console.log(error)
    }
}
start()