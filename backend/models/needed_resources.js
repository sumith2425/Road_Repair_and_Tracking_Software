const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const needed_resourcesschema = new mongoose.Schema({
    complaint_id:{
        type: ObjectId,
        ref: "COMPLAINT"
    },
    priority:{
        type:Number,
        required:true
    },
    time:{
        type:Number,
        required:true
    },
    Workers: {
        type: Number,
        required: true,
    },
    Civil_Engineers: {
        type: Number,
        required: true,
    },
    Site_Supervisors: {
        type: Number,
        required: true,
    },
    Asphalt_in_kg: {
        type: Number,
        default:0,
        required: true
    },
    Concrete_in_kg: {
        type: Number,
        default:0,
        required: true
    },
    Gravel_in_kg: {
        type: Number,
        default:0,
        required: true
    },
    Road_Roller:{
        type: Number,
        default:0,
        required: true,
    },
    Excavators:{
        type: Number,
        default:0,
        required: true,
    },
    Dump_Trucks:{
        type: Number,
        default:0,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status:{
        type:String,
        default:"pending"
    },
    city:{
       type:String
    },
    suburb:{
        type:String
    },


})

mongoose.model("NEEDED_RESOURCES" , needed_resourcesschema)