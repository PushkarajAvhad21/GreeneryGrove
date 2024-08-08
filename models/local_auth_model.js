const mongoose=require('mongoose')
const TaskSchema=new mongoose.Schema({
    
    user_name:{
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
    role:{
        type:String,
        default:"user"
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    }

})
module.exports=mongoose.model('User2',TaskSchema)