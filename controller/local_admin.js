const User2=require('../models/google_admin.js')
const {hashSync}=require('bcrypt')
const {compareSync}=require('bcrypt')
const path=require('path')

const home=async(req,res)=>{
    try {
        res.render("home_local")
        if(req.isAuthenticated()){
            console.log("hello")
            console.log(req.user)
        }
        
    } catch (error) {
        console.log(error);
    }
}

const load_register=async(req,res)=>{
    try {
        // res.render("register_local")
        res.sendFile(path.join(__dirname,"../index/signup.html"))
    } catch (error) {
        console.log(error);
    }
}

const load_login=async(req,res)=>{
    try {
        // res.render("login_local")
        res.sendFile(path.join(__dirname , "../index/loginandregister.html"))
        
    } catch (error) {
        console.log(error);
    }
}

const register=async(req,res)=>{
    try {
        // res.send("home")
        console.log(req.body.email)
        const user =await User2.findOne({email:req.body.email,
                name:req.body.name})
        if(user){
            return res.status(400).send("user already exsist")
        }
        if(req.body.cpassword===req.body.password){
            const data={
                email:req.body.email,
                password:hashSync(req.body.password,10) ,
                name:req.body.name,
                phone:req.body.phone,
                address:req.body.address
            }
            console.log(data)
            const newUser = await User2.create(data)
            res.redirect("/login")
            // res.status(201).send(newUser)
        }
        else{
            res.status(400).send("password dont match, try again!!!")

        }
        
    } catch (error) {
        console.log(error);
    }
}

const login=async(req,res)=>{
    try {
        res.send("home")
        
    } catch (error) {
        console.log(error);
    }
}

const logout=async(req,res)=>{
    try {
        console.log("bye")
        req.logout();
        console.log("hello"+req.session)
        res.redirect('/login')
        
    } catch (error) {
        console.log(error);
    }
}
const protect = async (req, res) => {
    // console.log(req)
    console.log("hi" + req.isAuthenticated()); // Log within the route handler
    if (req.isAuthenticated()) {
        res.redirect('/')
        // res.send("Protected");
    } else {
        res.status(401).send({ msg: "unauthorized" });
    }
    console.log(req.session);
    console.log(req.user);
};
module.exports={home,register,login,load_register,load_login,logout,protect}