const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    lat:{
        type:Number,
    },
    lng:{
        type:Number,
    },
    order:{
        type:Number,
    }
},{_id:false})


const route = new mongoose.Schema({
    routeName:{
        type:String,
        required:true,
        unique:true
    },
    stops:[stopSchema]

},{timestamps:true})


module.exports = mongoose.model("route",route);