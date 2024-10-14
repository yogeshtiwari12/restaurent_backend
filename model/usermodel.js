import mongoose from "mongoose";
const userModel = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
     type:String,
     required:true,
     unique:true
    },
    phone:{
        type:String,                    
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true 
    },
    photo:{
        public_id:{

            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    role:{
        type:String,
        required:true,
        enum: ['admin', 'user']  
    }

})

const User = mongoose.model('User', userModel);
export default User;