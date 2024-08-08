const express=require('express');
const router=express.Router();
const passport=require('passport')
// const passport=require('passport')
// const {initializingPassport} = require('../config/passport-setup-local.js')
const {home,register,login,load_register,load_login,logout,protect}=require("../controller/local_admin.js")
router.route('/register').post(register);
router.route('/register').get(load_register);
router.route('/login').get(load_login);
router.route('/login').post(passport.authenticate("local-admin"),protect)

router.route('/auth/logout').get(logout);
router.route('/home').get(home);
router.route('/protected').get(protect);
// router.route('/update').post(updateUser);
// router.route('/delete').post(deleteUser);
module.exports=router