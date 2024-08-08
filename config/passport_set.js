const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User1 = require('../models/local_auth_model.js');
const User2 = require('../models/google_admin.js');
const keys = require('./keys.js');
const { compareSync } = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user1 = await User1.findById(id) || await User2.findById(id);
        if (user1) {
            return done(null, user1);
        }
    } catch (err) {
        done(err);
    }
});

passport.use('local-user',new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const user = await User1.findOne({ email });
        if (!user || !compareSync(password, user.password)) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use('google-user',new GoogleStrategy({
    callbackURL: 'https://greenerygrove.onrender.com/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {  //this is the callback function which get fired when the actual profile info is with us
    try {
        User1.findOne({email:profile.emails[0].value}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null,currentUser)
                // do something
            } else {
                // if not, create user in our db
                new User1({
                    name: profile.displayName,
                    googleId: profile.id,
                    email:profile.emails[0].value
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    // do something 
                    done(null,newUser)
                });
            }
        });
        // If the user doesn't exist, you can create a new User2 here if needed
        // Example:
        // const newUser2 = await new User2({
        //     googleId: profile.id,
        //     username: profile.displayName,
        // }).save();
        // return done(null, newUser2);
    } catch (err) {
        done(err);
    }
}));

passport.use('local-admin',new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const user2 = await User2.findOne({ email });
        if (!user2 || !compareSync(password, user2.password)) {
            return done(null, false);
        }
        return done(null, user2);
    } catch (error) {
        console.log(error)
        done(error, false);
    }
}));

passport.use('google-admin',new GoogleStrategy({
    callbackURL: 'https://greenerygrove.onrender.com/admin/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {  //this is the callback function which get fired when the actual profile info is with us
    try {
        User2.findOne({ email:profile.emails[0].value}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null,currentUser)
                // do something
            } else {
                // if not, create user in our db
                new User2({
                    name: profile.displayName,
                    googleId: profile.id,
                    email:profile.emails[0].value
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    // do something
                    done(null,newUser)
                });
            }
        });
        // If the user doesn't exist, you can create a new User2 here if needed
        // Example:
        // const newUser2 = await new User2({
        //     googleId: profile.id,
        //     username: profile.displayName,
        // }).save();
        // return done(null, newUser2);
    } catch (err) {
        done(err);
    }
}));
