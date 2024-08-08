const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20')
require('dotenv').config()
const User1=require('../models/auth_model.js')
const keys=require('./keys.js')

passport.serializeUser((user,done)=>{
    // if(req.user){
        console.log("hello")
        done(null,user.id)
    // }
});

passport.deserializeUser((id,done)=>{
    User1.findById(id).then((user)=>{
        done(null,user)
    });
});

passport.use(
    new GoogleStrategy({
        //options for google strategy
        callbackURL:'/auth/google/redirect',
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
        
    },(accessToken,refreshToken,profile,done)=>{
        //passport call function
        // console.log("pcf fired");
        console.log(profile)
        User1.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null,currentUser)
                // do something
            } else {
                // if not, create user in our db
                new User1({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    // do something
                    done(null,newUser)
                });
            }
        });
    })
)