const bcrypt=require("bcryptjs");
const User=require("../Models/user");

const emailPattern=/^\S+@\S+\.\S+$/;

const isValidEmail=(email)=>emailPattern.test(email);

const hashPassword=async(password)=>bcrypt.hash(password,10);

//displaying all users
const getAllUsers=async(req,res)=>
{
    let users

    //get all users from database
    try{
        users=await User.find(); //finding every user and displaying them
    }catch(err){
        console.log(err);
    }

    //displaying all users
    return res.status(200).json({users});
}
//http://localhost:5000/users

//inserting a new user
const addUser=async(req,res,next)=>{
    const {name,email,password,countrycode,contactno}=req.body;
    //req.body means the data the client sends to the server in the form of a request body. It is used to send data from the client to the server in an HTTP request. The data can be in various formats, such as JSON, form data, or URL-encoded data. In this case, it is used to extract the user details (name, email, password, country code, and contact number) from the request body.
    let users;

    if(!isValidEmail(email)){
        return res.status(400).json({message:"Please enter a valid email"});
    }

    if(!password || password.length<8){
        return res.status(400).json({message:"Password must be at least 8 characters"});
    }

    try{
        users=new User({
            name,
            email,
            password:await hashPassword(password),
            countrycode,
            contactno
            // If the names do not match, Mongoose will not put the value into the expected field. 
            // For example, if your schema says contactno but you send contactNumber, then contactno stays empty and the required field check may fail.
        })
        await users.save();
    }catch(err){
        console.log(err);
    }
    
    //not inserting a new user
    if(!users){
        return res.status(404).json({message:"Unable to add user"})
    }

    return res.status(201).json({users,message:"User successfully added"});
}

//getting a user by id
const getById=async(req,res,next)=>{
    const id=req.params.id; //finding the particular user by id
    let users;

    try{
        user=await User.findById(id);
    }catch(err){
        console.log(err);
    }

    //not available users
    if(!user){
        return res.status(404).json({message:"No user found"})
    }   
    return res.status(200).json({user});
}
//http://localhost:5000/users/:id

//updating a user by id
const updateUser=async(req,res,next)=>{
    const id=req.params.id; //finding the particular user by id
    const {name,email,password,countrycode,contactno}=req.body;
    let users;
    let user;

    if(email && !isValidEmail(email)){
        return res.status(400).json({message:"Please enter a valid email"});
    }

    if(password && password.length<8){
        return res.status(400).json({message:"Password must be at least 8 characters"});
    }

    try{
        user=await User.findById(id);

        if(!user){
            return res.status(404).json({message:"Unable to update user by this id"})
        }

        user.name=name;
        user.email=email;
        user.countrycode=countrycode;
        user.contactno=contactno;

        if(password){
            user.password=await hashPassword(password);
        }

        users=await user.save(); //save the particular user after updating the details

    }catch(err){
        console.log(err);
    }

    //not available users
    if(!users){
        return res.status(404).json({message:"Unable to update user by this id"})
    }
    return res.status(200).json({users});

}
//http://localhost:5000/users/:id

//deleting a user by id
const deleteUser=async(req,res,next)=>{
    const id=req.params.id;
    
    let user;

    try{
        user=await User.findByIdAndDelete(id); //finding the particular user by id and deleting the user details
    }catch(err){
        console.log(err);
    }

    if(!user){
        return res.status(404).json({message:"Unable to delete user by this id"})
    }
    return res.status(200).json({user,message:"User successfully deleted"});
}

exports.getAllUsers=getAllUsers;
exports.addUser=addUser;
exports.getById=getById;
exports.updateUser=updateUser;
exports.deleteUser=deleteUser;
