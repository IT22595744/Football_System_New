const mongoose = require("mongoose");

const Schema=mongoose.Schema;

const teamSchema = new Schema(
    {
        teamId:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            uppercase:true
        },
        teamName :{
            type:String,
            required:true,
            trim:true
        },
        flag:{
            type:String,
            required:true,
            trim:true
        },
        flagKey:{
            type:String,
            trim:true
        },
        teamCoach:{
            type:String,
            required:true,
            trim:true
        },
        teamManager:{
            type:String,
            required:true,
            trim:true
        }
    }
);

module.exports = mongoose.model(
    "Team", //file name
    teamSchema //function name
);