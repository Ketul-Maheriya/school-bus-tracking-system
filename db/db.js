const mongoose = require("mongoose");

const connectDB = async() =>{

    try{
        await mongoose.connect("mongodb://localhost:27017/institute");
        console.log("MongoDB connected successfully");
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;