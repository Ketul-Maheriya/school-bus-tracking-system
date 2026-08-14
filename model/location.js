const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({

    bus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bus",
        required:true
    },
    lat:{
        type:Number,
        required:true
    },
    lng:{
        type:Number,
        required:true
    },
    speed:{
        type:Number,
        default:0
    },  
    heading:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports = mongoose.model("location",locationSchema);