import mongoose from "mongoose";
import cloudinary from 'cloudinary';
import Hotel from "../model/hotelmodel.js";
import Booking from "../model/room_model.js";
import Room from "../model/room_model2.js";



export const hotel = async (req, res) => {
    const { hotel_image } = req.files;
    if (!req.files || !req.files.hotel_image) {
        return res.status(400).json({ message: "No photo found" });
    }
    const allowedFormats = ["jpg", "png", "avif"];
    const fileFormat = hotel_image.name.split('.').pop();

    if (!allowedFormats.includes(fileFormat)) {
        return res.status(400).json({ message: "Invalid photo format" });
    }
    const { hotelname, location, total_rooms, room_price, room_no } = req.body;

    try {
        if (!hotelname || !location || !total_rooms || !room_price || !room_no) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const uploadResponse = await cloudinary.v2.uploader.upload(hotel_image.tempFilePath);
        const newHotel = new Hotel({
            hotelname,
            location,
            total_rooms,
            room_price,
            room_no,
            hotel_image: {
                public_id: uploadResponse.public_id,
                url: uploadResponse.secure_url,
            }
        });
        await newHotel.save();
        res.status(201).json({ message: "Hotel created successfully", hotel: newHotel });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating hotel", message: error.message });

    }
}

export const saveroomdetails = async (req, res) => {
    const { photo1, photo2, photo3 } = req.files;

    if (!photo1 || !photo2 || !photo3) {
        return res.status(400).json({ message: "All three photos are required" });
    }
    const { hotelname, roomType, description,total_rooms } = req.body;
    try {

        const hoteid = req.params.id;
        const ishotelexist = await Hotel.findById(hoteid);
        const hotelroomtype = await Hotel.findOne({ roomType });
        if (ishotelexist && hotelroomtype) {
            return res.status(400).json({ message: "Room details already exist for this hotel" });
        }
        const uploadResponse1 = await cloudinary.v2.uploader.upload(photo1.tempFilePath);
        const uploadResponse2 = await cloudinary.v2.uploader.upload(photo2.tempFilePath);
        const uploadResponse3 = await cloudinary.v2.uploader.upload(photo3.tempFilePath);

        const roomdetails = new Room({
            hotelname,
            roomType,
            description,
            total_rooms,
            photo1: {
                public_id: uploadResponse1.public_id,
                url: uploadResponse1.secure_url,
            },

            photo2: {
                public_id: uploadResponse2.public_id,
                url: uploadResponse2.secure_url,
            },
            photo3: {
                public_id: uploadResponse3.public_id,
                url: uploadResponse3.secure_url,
            }
        })
        await roomdetails.save();
        res.status(201).json({ message: "Room Details Saved Successfully", roomdetails: roomdetails });

    } catch (error) {
        return res.status(500).json({ message: "Error saving room details", error: error.message });
    }

}


export const deleteone = async (req, res) => {
    const hotelid = req.params.id;

    try {
        const hoteldata = await Hotel.findById(hotelid)
        console.log(hoteldata)
        if (!hoteldata) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        await hoteldata.deleteOne();
        res.status(200).json({ message: "Hotel deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting hotel", error: error.message });
    }
}



export const booksingleroom = async (req, res) => {
    const { user_hotel_name, user_room_no, total_price } = req.body;

    try {
        const user_name = req?.user?.name;
        const user_email = req?.user?.email;
        const user_phone_number = req?.user?.phone;


        const hotelData = await Hotel.findOne({ hotelname: user_hotel_name });
        if (!hotelData) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        if (hotelData.total_rooms <= 0) {
            return res.status(400).json({ message: "No rooms available" });
        }

        const assignedRoomNo = user_room_no;

        hotelData.total_rooms -= 1;
        await hotelData.save();

        const updatedTotalPrice = total_price;

        const newBooking = new Booking({
            user_name: user_name,
            user_email: user_email,
            user_phone_number: user_phone_number,

            user_hotel_name: user_hotel_name,
            user_room_no: assignedRoomNo,
            total_price: updatedTotalPrice,
        });

        await newBooking.save();

        res.json({
            message: "Room booked successfully",
            details: {
                newBooking,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Error processing room booking",
            error: error.message,
        });
    }
};

export const deletebooking = async (req, res) => {
    try {
        const useraccount = req.user.email;

        if (!useraccount) {
            return res.status(403).json({ message: "User account not authorized" });
        }

        const deleteted_data = await Booking.deleteOne({ user_email: useraccount });

        if (deleteted_data.deletedCount === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }
        return res.status(200).json({ message: "bookings deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting bookings", error: error.message });
    }
};



export const gethoteldata = async (req, res) => {
    try {
        const hoteldata = await Hotel.find({}).select("-room_no -total_price");


        if (!hoteldata.length) {
            return res.status(404).json({ message: "No hotel found" });
        }
        const totalPriceResult = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total_price" }
                }
            }
        ]);
        const total_price = totalPriceResult.length > 0 ? totalPriceResult[0].total : 0;

        res.json({
            message: "All hotel data fetched successfully",
            hotel: hoteldata,
            total_price
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving hotel data", error: error.message });
    }
};



export const updatedetails = async (req, res) => {
    const hotelid = req.params.id;
    try {
        const updatedata = await Hotel.findByIdAndUpdate(hotelid, req.body, { new: true });


        if (!updatedata) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json({ message: "Hotel updated successfully", hotel: updatedata });

    } catch (error) {
        res.status(500).json({ message: "Error updating hotel", error: error.message });

    }

}
export const roomdetails_related_to_hotel = async (req, res) => {
    const { hotelname } = req.body;
    try {
        const allroomdata = await Room.find({ hotelname })

        if (!allroomdata) {
            return res.status(404).json({ message: "Hotel related to room are not found" });
        }
        res.json({ message: "Data Fetced successfully", allroomdata: allroomdata });

    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving room details", error: error.message });
    }
}