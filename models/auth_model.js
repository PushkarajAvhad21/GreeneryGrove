const mongoose=require('mongoose')
const TaskSchema=new mongoose.Schema({
    
    user_name:{
        type:String
    },
    googleId:{
        type:String
    },
    name:{
        type:String
    },
    phone:{
        type:String
    },
    address:{
        type:String
    }

    
})
module.exports=mongoose.model('User1',TaskSchema)