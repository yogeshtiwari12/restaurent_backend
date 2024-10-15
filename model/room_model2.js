import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({


  hotelname: {
    type: String,
    required: true
  },

  roomType: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },

  total_rooms: {
    type: Number,
    required: true
  },

  photo1: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  photo2: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  photo3: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }
  ,
  hotelId: {  // More intuitive name than 'createdBy'
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    // required: true   // Ensure that each room is associated with a hotel
  }

});

const Room = mongoose.model('Room', roomSchema);

export default Room;