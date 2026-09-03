const express = require("express");
const router2= express.Router();

const User=require("../Models/user");

const LoginController=require("../Controllers/logincontroller");

router2.post("/",LoginController.loginUser);//adding we use post method

module.exports=router2
