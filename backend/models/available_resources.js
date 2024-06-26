const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const available_resourcesschema = new mongoose.Schema({
    complaint:{
        type: ObjectId,
        ref: "COMPLAINT",
        required:false
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

    Workers_inuse: {
        type: Number,
    },
    Civil_Engineers_inuse: {
        type: Number,      
    },
    Site_Supervisors_inuse: {
        type: Number,  
    },
    Road_Roller_inuse:{
        type: Number,
        default:0,
    },
    Excavators_inuse:{
        type: Number,
        default:0,
    },
    Dump_Trucks_inuse:{
        type: Number,
        default:0,
    },

})

mongoose.model("AVAILABLE_RESOURCES" , available_resourcesschema)