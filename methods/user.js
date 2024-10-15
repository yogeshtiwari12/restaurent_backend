import User from "../model/usermodel.js";
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import Booking from "../model/room_model.js";
const jwtkey = "yogesh12345sGDSDSs"

export const signup = async (req, res) => {
  const { photo } = req.files;
  if (!req.files || !req.files.photo) {
    return res.status(400).json({ message: "No photo found" });
  }

  const allowedFormats = ["jpg", "png"];
  const fileFormat = photo.name.split('.').pop();

  if (!allowedFormats.includes(fileFormat)) {
    return res.status(400).json({ message: "Invalid photo format" });
  }

  const { name, email, phone, password, role } = req.body;
  try {
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadResponse = await cloudinary.v2.uploader.upload(photo.tempFilePath);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      photo: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url
      }
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", });

  } catch (error) {
    return res.send("User registration failed : " + error.message)
  }
};




export const login = async (req, res) => {

  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(200).json({ message: `User with role ${role} is not found` });
    }

    jwt.sign({ id: user._id }, jwtkey, { expiresIn: "2h" }, (error, token) => {
      if (error) {
        return res.json({ message: "token Error", error: error.message });
      }


      res.cookie('token', token)

      res.json({
        message: 'Logged in successfully'
      })
    }
    )
  }
  catch (error) {
    return res.send("User login failed : " + error.message)
  }
}




export const logout = (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.json({ message: ' Token not found' });
    }
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    return res.status(500).json({ message: "Error logging out", error: error.message });

  }
}

export const getMyProfile = async (req, res) => {
  try {
    const user = req.user;
    const email = user.email;
    const bookingdetails = await Booking.find({ user_email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!bookingdetails) {
      return res.status(404).json({ message: "User not found " });
    }

    const  userprofile = {
        name: user.name,
        email: user.email ,
        phone: user.phone,
        role: user.role,
      }

    const bookings = bookingdetails.map(booking => ({
      hotel_name: booking.user_hotel_name,
      room_no: booking.user_room_no,  
      total_price: booking.total_price,
      booking_date: booking.user_date
      
    }));

    res.json({ message: "User profile fetched successfully",
       user:userprofile, 
       bookings:bookings });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getalladmin = async (req, res) => {
  try {
    const admin = await User.find({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "No admin found" });
    }
    res.json({ message: "All admin fetched successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving admin data", error: error.message });
  }
}

