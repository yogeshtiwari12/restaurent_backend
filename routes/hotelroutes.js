import express from 'express';
import { booksingleroom, deletebooking, deleteone, gethoteldata,  hotel, saveroomdetails, updatedetails } from '../methods/hotel.js';

import { isadmin,  verifytoken } from '../routes/auth.js';
const route = express.Router();

route.post('/hotel',hotel);
route.delete('/deleteone/:id',verifytoken,isadmin("admin"),deleteone);
route.get('/gethoteldata',verifytoken,isadmin("admin"),gethoteldata);
route.post('/saveroomdetails',verifytoken,isadmin("admin"),saveroomdetails);
route.post('/update/:id',verifytoken,isadmin("admin"),updatedetails);
route.delete('/deleteone',verifytoken,isadmin("admin"),deletebooking);

route.post('/booksingleroom',verifytoken, booksingleroom);
export default route;       