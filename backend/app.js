const express = require('express');
const cors = require('cors');
const app = express()
const port = 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");


const ipAddress = '127.0.0.1';
app.use(cors({}));
require('./models/user')
require('./models/complaint');
require('./models/needed_resources');
require('./models/available_resources');
app.use(express.json());
app.use(require("./routes/auth"));
mongoose.connect(mongoUrl);

mongoose.connection.on("connected",()=>{
    console.log("successfully connected to mongo")
})
mongoose.connection.on("error",()=>{
    console.log("not connected to mongo")
})

app.listen(port,() => {
    console.log("server is running on port" + " " + port)
})