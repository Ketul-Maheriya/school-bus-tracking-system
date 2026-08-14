require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./db/db");
const router = require("./router/route");
const app = express();

app.use(cors());
connectDB();

app.use(express.json());

app.use("/",router);


app.listen(3000,()=>{
    console.log("Server is running on PORT: http://localhost:3000")
})
