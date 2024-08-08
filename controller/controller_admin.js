// const User = require("../models/model.js")

const createUser=async(req,res)=>{
    try {
        const data=req.body;
        const task1 = await User.create(data);
        res.status(200).json(task1);
    } catch (error) {
       console.log(error);
    }
    
}
const getAll=async(req,res)=>{
    try {
        const task2=await User.find()
        res.status(200).json(task2)
    } catch (error) {
        console.log(error)
    }
}
const updateUser=async(req,res)=>{
    try {
        const getuserupdate={
            user_name:req.body.user_name
        }
        
        const update_data={
            name:req.body.name,
            phone:req.body.phone,
            address:req.body.address
        };
        // console.log(update_data)

        const task3=await User.findOneAndUpdate(getuserupdate,update_data,{
            returnOriginal: false
        })
        res.status(200).json(task3);
        // console.log({task3});
    } catch (error) {
        console.log(error)
    }
}
const deleteUser=async(req,res)=>{
    try {
        const getuserdelete={
            user_name:req.body.user_name
        }
        const task4=await User.findOneAndDelete(getuserdelete)
        console.log("deleted successfully!!")
    } catch (error) {
        console.log(error)
    }
}
module.exports={createUser,getAll,updateUser,deleteUser}