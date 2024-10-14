import express from "express";
import { getalladmin , getMyProfile, login, logout, signup } from "../methods/user.js";
import { isadmin, verifytoken } from "./auth.js";

const routes = express.Router();
routes.post('/signup', signup);
routes.post('/login',login,verifytoken)
routes.post('/logout',logout,verifytoken);
routes.get('/getmyprofile',verifytoken,getMyProfile ) 

routes.get('/getalladmin',verifytoken,isadmin("admin"),getalladmin);

export default routes;