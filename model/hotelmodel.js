import mongoose from "mongoose";

const hotelmodel = mongoose.Schema({

    // user: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'User', 
    //     required: true 
    //   },

    hotelname:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    total_rooms:{
        type: Number,
        required: true
    },
    room_price:{
        type: Number,
        required: true
    },
    room_no:{
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        default: 0,  // Set default value to 0
        // required: true  // Uncomment if required
    },
    
    hotel_image:{
        public_id:{

            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    adminname:{
        type:String,
        // required:true
    },
    adminphoto:{
        type:String,
        // required:true
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"blog"
    }

})
 
const Hotel = mongoose.model('Hotel', hotelmodel);
export default Hotel;