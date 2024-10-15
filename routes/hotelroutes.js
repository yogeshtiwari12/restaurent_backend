import express from 'express';
import { booksingleroom, deletebooking, deleteone, gethoteldata,  hotel, roomdetails_related_to_hotel, saveroomdetails, updatedetails } from '../methods/hotel.js';

import { isadmin,  verifytoken } from '../routes/auth.js';
const route = express.Router();

route.post('/hotel',hotel);
route.delete('/deleteone/:id',verifytoken,isadmin("admin"),deleteone);
route.get('/gethoteldata',verifytoken,isadmin("admin"),gethoteldata);
route.put('/saveroomdetails/:id',verifytoken,isadmin("admin"),saveroomdetails);
route.post('/update/:id',verifytoken,isadmin("admin"),updatedetails);
route.delete('/deleteone',verifytoken,isadmin("admin"),deletebooking);
route.get('/roomdetails_related_to_hotel',verifytoken,isadmin("admin"),roomdetails_related_to_hotel);

route.post('/booksingleroom',verifytoken, booksingleroom);
export default route;       

