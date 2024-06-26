const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    suburb:{
        type: String,
    },
    city:{
        type: String,
    },
    position:{
        type:String
    },
    name:{
        type:String
    },
    phoneno:{
        type:String
    },
    Email:{
        type: String,
    },
    Issignin:{
        type:Number
    },
    
})

mongoose.model("USER", userSchema)