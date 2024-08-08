const express=require('express')
const passport=require('passport')
const router = express.Router()
const {login,logout,google,redirect,protected}=require("../controller/google_admin.js")
// router.route('/login').get(login)
router.route('/logout').get(logout)
router.route('/google' ).get( passport.authenticate('google-admin',{
    scope:['profile','email']
}));
router.route('/google/redirect').get(passport.authenticate('google-admin'), redirect)
router.route('/protected').get(protected)

module.exports=router