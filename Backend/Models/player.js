const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        team_name:{
            type:String,
            required:true,
            trim:true
        },
        jersey_no:{
            type:Number,
            required:true,

        },
        position:{
            type:String,
            required:true,
            trim:true
        },
        player_img:{
            type:String,
            required:true,
            trim:true
        },
        player_img_key:{
            type:String,
            trim:true
        }

    }
);

module.exports = mongoose.model('Player',playerSchema);