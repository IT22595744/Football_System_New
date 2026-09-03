
const bcrypt=require("bcryptjs");
const User=require("../Models/user");

const loginUser=async(req,res,next) =>{
    const {email,password}=req.body;

    let user;
    try{
        user=await User.findOne({email});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        return res.status(200).json({
            message:"Login successful",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            countrycode:user.countrycode,
            contactno:user.contactno
        }});
    }catch(err){
        console.log(err);
    return res.status(500).json({message:"Login failed"});
}
};

exports.loginUser=loginUser;