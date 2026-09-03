const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    countrycode:{
        type:String,
        required:true
    },
    contactno:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model(
    'User',//file name
    userSchema //function name
)