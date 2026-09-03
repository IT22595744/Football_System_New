const express=require("express");
const router1=express.Router();

//Insert Model
const User=require("../Models/user");
//Insert User Controller
const UserController=require("../Controllers/usercontroller");

router1.get("/",UserController.getAllUsers);//displaying we use get method
router1.post("/",UserController.addUser);//adding we use post method
router1.get("/:id",UserController.getById);//getting the details one particular user we use get method /:id should be same as in user controller getbyid function=>id=req.params.id
router1.put("/:id",UserController.updateUser);//updating the particular user details we use put method
router1.delete("/:id",UserController.deleteUser);//deleting the particular user details we use delete method
//export
module.exports=router1