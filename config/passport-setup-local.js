const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy;
require('dotenv').config()
const User2=require('../models/local_auth_model.js')
const {compareSync}=require('bcrypt')
const keys=require('./keys.js')
console.log("hello")
 
passport.use(
        // console.log("hello")
        new LocalStrategy({
            usernameField:"user_name", passwordField:"password"
        },async (user_name,password,done)=>{
            
            try {
                const user=await User2.findOne({user_name})
        
                if(!user){
                    return done(null,false)
                }
                if(!compareSync(password,user.password)){
                    console.log("hello")
                    return done(null,false)
                }
                return done(null,user)
            
            } catch (error) {
                // return done(error,false)
                console.log(error)
            }
    
    
        })
    )
    passport.serializeUser((user,done)=>{
        // if(req.user){

            done(null,user.id)
        // }
    });
    
    passport.deserializeUser((id,done)=>{
        User2.findById(id).then((user)=>{
            done(null,user)
        });
    });



