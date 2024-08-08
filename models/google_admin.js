const mongoose=require('mongoose')
const Nursery=require('./nurseries.js')
const TaskSchema=new mongoose.Schema({
    
    username:{
        type:String
    },
    name:{
        type:String
    },
    cpassword:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    nursery: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Nursery'
    },
    role:{
        type:String,
        default:"admin"
    }

})
module.exports=mongoose.model('Admin_login',TaskSchema)