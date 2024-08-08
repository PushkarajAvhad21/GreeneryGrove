const express=require('express');
const router=express.Router();
const {createUser,getAll,updateUser,deleteUser}=require("../controller/controller_admin.js")
router.route('/create').post(createUser);
router.route('/get').get(getAll);
router.route('/update').post(updateUser);
router.route('/delete').post(deleteUser);
module.exports=router