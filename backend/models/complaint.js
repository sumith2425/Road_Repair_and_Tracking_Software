const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    Address: {
        type: String,
        required: true,
    },
    Problem: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    suburb:{
       type:String,
       required:true
    },
    city:{
        type:String,
        required:true
    },
    status:{
        type:String,
    }
})

mongoose.model("COMPLAINT" , complaintSchema)