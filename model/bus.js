const mongoose = require('mongoose');

const bus = new mongoose.Schema({
    busNumber:{
        type:String,
        required:true,
        unique:true
    },
    capacity:{
        type:Number,
        required:true
    },
    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    route:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"route"
    },
    status:{
        type:String,
        enum:["active","inactive","maintenance"],
        default:"inactive"
    },
    currentLocation:{
        lat:{type:Number,default:null},
        lng:{type:Number,default:null},
        speed:{type:Number,default:0},
        heading:{type:Number,default:0},
        updatedAt:{type:Date,default:null}
    }
},{timestamps:true})

module.exports = mongoose.model("bus",bus);