import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  user_name: { 
    type: String, 
    required: true 
  },
  user_email: { 
    type: String, 
    required: true 
  },
  user_phone_number: { 
    type: String, 
    required: true 
  },
  user_hotel_name: { 
    type: String, 
    required: true 
  },
  user_room_no: { 
    type: Number, 
    required: true 
  },
  total_price: { 
    type: Number, 
    required: true 
  },
  user_date: { 
    type: Date, 
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
