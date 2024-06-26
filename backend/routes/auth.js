const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const COMPLAINT = mongoose.model("COMPLAINT")
const user = mongoose.model("USER")
const NEEDED_RESOURCES=mongoose.model("NEEDED_RESOURCES")
const AVAILABLE_RESOURCES=mongoose.model("AVAILABLE_RESOURCES");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const update_work_schedule=async()=>{
    const complaints_resources = await NEEDED_RESOURCES.find().sort({ priority: 1, time: 1, Workers: 1 });
    const available_resources = await AVAILABLE_RESOURCES.findOne();
    available_resources.Workers_inuse=0;
    available_resources.Civil_Engineers_inuse=0;
    available_resources.Site_Supervisors_inuse=0;
    available_resources.Dump_Trucks_inuse=0;
    available_resources.Excavators_inuse=0;
    available_resources.Road_Roller_inuse=0;
    const allocateResources = async () => {
        for (const complaint of complaints_resources) {
            const { Workers,Civil_Engineers,Site_Supervisors, Asphalt_in_kg, Concrete_in_kg, Gravel_in_kg, Road_Roller, Excavators, Dump_Trucks
            } = complaint;
            if(complaint.status=="pending"||complaint.status=="ongoing"){
            if (
                Workers+available_resources.Workers_inuse <= available_resources.Workers &&
                Civil_Engineers+available_resources.Civil_Engineers_inuse <= available_resources.Civil_Engineers &&
                Site_Supervisors +available_resources.Site_Supervisors_inuse<= available_resources.Site_Supervisors &&
                Asphalt_in_kg <= available_resources.Asphalt_in_kg &&
                Concrete_in_kg <= available_resources.Concrete_in_kg &&
                Gravel_in_kg <= available_resources.Gravel_in_kg &&
                Road_Roller +available_resources.Road_Roller_inuse<= available_resources.Road_Roller &&
                Excavators+available_resources.Excavators_inuse <= available_resources.Excavators &&
                Dump_Trucks +available_resources.Dump_Trucks_inuse<= available_resources.Dump_Trucks
            ) {
                available_resources.Workers_inuse += Workers;
                available_resources.Civil_Engineers_inuse+=Civil_Engineers;
                available_resources.Site_Supervisors_inuse += Site_Supervisors;
                available_resources.Asphalt_in_kg -= Asphalt_in_kg;
                available_resources.Concrete_in_kg -= Concrete_in_kg;
                available_resources.Gravel_in_kg -= Gravel_in_kg;
                available_resources.Road_Roller_inuse += Road_Roller;
                available_resources.Excavators_inuse += Excavators;
                available_resources.Dump_Trucks_inuse += Dump_Trucks;
    
                await available_resources.save();
                const updatestatus=await NEEDED_RESOURCES.findByIdAndUpdate(complaint._id, { status: "ongoing" }, { new: true })
                const complete_resource = await COMPLAINT.findByIdAndUpdate(complaint.complaint_id, { status: "ongoing" }, { new: true });
            } else {
                const updatestatus=await NEEDED_RESOURCES.findByIdAndUpdate(complaint._id, { status: "pending" }, { new: true })
                const complete_resource = await COMPLAINT.findByIdAndUpdate(complaint.complaint_id, { status: "pending" }, { new: true });
            }
          }
        }
    };
    allocateResources();
    const updateNeededresources=await AVAILABLE_RESOURCES.findOneAndUpdate(
        {_id:available_resources._id},
        {Workers_inuse:available_resources.Workers_inuse,Civil_Engineers_inuse:available_resources.Civil_Engineers_inuse,Site_Supervisors_inuse :available_resources.Site_Supervisors_inuse,Asphalt_in_kg_inuse :available_resources.Asphalt_in_kg_inuse,Concrete_in_kg_inuse :available_resources.Concrete_in_kg_inuse,Gravel_in_kg_inuse :available_resources.Gravel_in_kg_inuse,Road_Roller_inuse :available_resources.Road_Roller_inuse,Excavators_inuse :available_resources.Excavators_inuse ,  
        Dump_Trucks_inuse :available_resources.Dump_Trucks_inuse },
        {new:true}
    );
};

router.get('/',(req,res)=>{
    res.send("hello")
})

router.post('/sign__in', async (req, res) => {
    try {
        const { UserID, password } = req.body;
        if (!UserID || !password) {
            return res.status(422).json({ error: "Please add UserID and password" })
        }
        const savedUser = await user.findOne({ UserID: UserID });
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid UserID" })
        }
        if (password === savedUser.password) {
            return res.json({ savedUser });
        } else {
            return res.status(422).json({ error: "Invalid password" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/allcomplaints", async (req, res) => {
    const { suburb, city, status } = req.query;
    let query = {}; 
    
    if(suburb!="all"){
        query.suburb = suburb;
        query.city= city;
    }
    if (status) {
        query.status = status;
    }
    try {
        const complaints = await COMPLAINT.find(query)
            .sort("-date")
            .exec();
        res.json(complaints);
    } catch (err) {
        console.error("Error fetching complaints:", err);
        res.status(500).json({ error: "Failed to fetch complaints" });
    }
});

router.delete("/deletecomplaint/:id", async (req, res) => {
    const {id} = req.params;
  
    try {
      await COMPLAINT.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
});

router.get("/allresources", async (req, res) => {
    const { status } = req.query;
    let query = {status}; 
    try {
        const resources = await NEEDED_RESOURCES.find(query)
            .sort("-date")
            .exec();
        res.json(resources);
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).json({ error: "Failed to fetch resources" });
    }
});

router.get("/getcomplaint", async (req, res) => {
    const { complaint_id } = req.query; // Extract complaint_id from query parameters
    try {
        const complaint = await COMPLAINT.findById(complaint_id);
        res.json(complaint);
    } catch (err) {
        console.error("Error fetching complaint:", err);
        res.status(500).json({ error: "Failed to fetch complaint" });
    }
});

router.get("/get_data_form", async (req, res) => {
    const { complaint_id } = req.query;
    let query = {complaint_id}; 
    console.log(query);
    try {
        const resources = await NEEDED_RESOURCES.findOne(query)
        return res.json(resources);
    } catch (err) {
        console.error("Error fetching resources:", err);
        return res.status(500).json({ error: "Failed to fetch resources" });
    }
});
router.post('/complaint_post',async (req,res)=>{
    const{Address,Problem,suburb,city,status} = req.body;
    if (!Address || !Problem) {
        return res.status(422).json({ error: "Please add Address and Problem" })
    }
    const complaint = new COMPLAINT({
        Address,
        Problem,
        suburb,
        city,
        status
    });
    await complaint.save()
    .then(result => {res.json({post: result})})
    .catch(err => {console.log(err)})
});

router.post('/edit_profile', async (req, res) => {
    const { UserID, password,name,phoneno} = req.body;
    try {
        const updatedUser = await user.findOneAndUpdate(
            { UserID: UserID},
            { password: password ,name:name,phoneno:phoneno},
            { new: true }
        );
        if (!updatedUser) {
            return res.status(422).json({ error: "Invalid UserID" });
        }
        return res.json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/add_user', async (req, res) => {
    const { UserID, password, name, phoneno, suburb, city, position } = req.body;
    try {
        const newUser = new user({ 
            UserID: UserID,
            password: password,
            name: name,
            phoneno: phoneno,
            suburb: suburb,
            city: city,
            position: position,
            email:"",
        });
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/data_post', async (req, res) => {
    const {
        complaint_id,priority,time,Workers,Civil_Engineers,Site_Supervisors,Asphalt_in_kg,Concrete_in_kg,Gravel_in_kg,Road_Roller,Excavators,Dump_Trucks} = req.body;

    try {
        if (!priority || !Workers ) {
            return res.status(422).json({ error: "Please add priority and Workers" });
        }
        const status="pending"
        const updatedComplaint = await COMPLAINT.findByIdAndUpdate(complaint_id, { status: "pending" }, { new: true });
        const city=updatedComplaint.city;
        const suburb=updatedComplaint.suburb;
        const data_form = new NEEDED_RESOURCES({
            complaint_id, priority, time,Workers,Civil_Engineers,Site_Supervisors,Asphalt_in_kg,Concrete_in_kg,Gravel_in_kg,Road_Roller,Excavators,Dump_Trucks,status,city,suburb
        });
        const savedData = await data_form.save();
        
        res.json({ post: savedData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/edit_data_post', async (req, res) => {
    const {
        complaint_id,priority,time,Workers,Civil_Engineers,Site_Supervisors,Asphalt_in_kg,Concrete_in_kg,Gravel_in_kg,Road_Roller,Excavators,Dump_Trucks} = req.body;

    try {
        const updatedUser = await NEEDED_RESOURCES.findOneAndUpdate(
            { complaint_id:complaint_id},
            {   priority:priority,
                time:time,
                Workers:Workers,
                Civil_Engineers:Civil_Engineers,
                Site_Supervisors:Site_Supervisors,
                Asphalt_in_kg:Asphalt_in_kg,
                Concrete_in_kg:Concrete_in_kg,
                Gravel_in_kg:Gravel_in_kg,
                Road_Roller:Road_Roller,
                Excavators:Excavators,
                Dump_Trucks:Dump_Trucks},
            { new: true }
        );
        
        return res.json(updatedUser);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/update_resources', async (req, res) => {
    const{Workers,Civil_Engineers,Site_Supervisors,Asphalt_in_kg,Concrete_in_kg,Gravel_in_kg,Road_Roller,Excavators,Dump_Trucks} = req.body;
    try {
        const updatedUser = await AVAILABLE_RESOURCES.findOneAndUpdate(
            { },
            {   Workers:Workers,
                Civil_Engineers:Civil_Engineers,
                Site_Supervisors:Site_Supervisors,
                Asphalt_in_kg:Asphalt_in_kg,
                Concrete_in_kg:Concrete_in_kg,
                Gravel_in_kg:Gravel_in_kg,
                Road_Roller:Road_Roller,
                Excavators:Excavators,
                Dump_Trucks:Dump_Trucks},
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(422).json({ error: "Invalid UserID" });
        }
        return res.json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/workschedule", async (req, res) => {
    const { suburb, city, status } = req.query;
    try {
        const needed_resources = await COMPLAINT.find({ suburb, city, status }).exec();
        res.json(needed_resources);
    } catch (err) {
        console.error("Error fetching work schedule:", err);
        res.status(500).json({ error: "Failed to fetch work schedule" });
    }
});

router.get("/workschedulecomplete", async (req, res) => {
    const {id}  = req.query;
    try {
        const complete_resource = await NEEDED_RESOURCES.findOneAndUpdate({complaint_id:id}, { status: "completed" }, { new: true });
        await COMPLAINT.findByIdAndUpdate(id,{status:"completed"},{new:true});
        if (!complete_resource) {
            return res.status(404).json({ error: "Resource not found", id: id });
        }
        const existingResources = await AVAILABLE_RESOURCES.findOne({});

        existingResources.Workers_inuse-=complete_resource.Workers;
        existingResources.Civil_Engineers_inuse-=complete_resource.Civil_Engineers;
        existingResources.Site_Supervisors_inuse-=complete_resource.Site_Supervisors;       
        existingResources.Road_Roller_inuse-=complete_resource.Road_Roller;
        existingResources.Excavators_inuse-=complete_resource.Excavators;
        existingResources.Dump_Trucks_inuse-=complete_resource.Dump_Trucks;

        await existingResources.save();
        res.json(complete_resource);
    } catch (err) {
        console.error("Error completing work:", err);
        res.status(500).json({ error: "Failed to complete work", id: id });
    }
});

router.get("/update_work_schedule",async(req,res)=>{
    try{
        await update_work_schedule();
        res.json("work schedule updated");
    }
    catch(error){
        console.log(error);
        res.json(error);
    }  
});

router.get("/allcompleted", async (req, res) => {
    const { suburb, city ,status} = req.query;
    try {
        const completed= await NEEDED_RESOURCES.find({ suburb, city,status})
            .sort("-date")
            .exec();
        res.json(completed);
    } catch (err) {
        console.error("Error fetching complaints:", err);
        res.status(500).json({ error: "Failed to fetch complaints" });
    }
});

router.get("/get_available_resources", (req, res) => {
    AVAILABLE_RESOURCES.findOne()
        .then(resources => {   
        res.json(resources);
        })
        .catch(err => console.log(err))
        
});

router.get("/getcompletedclassworks",async(req,res)=>{
    try{
     const sWorks = await NEEDED_RESOURCES.countDocuments({ status: "completed", priority: 1 });
     const aWorks = await NEEDED_RESOURCES.countDocuments({ status: "completed", priority: 2 });
     const bWorks = await NEEDED_RESOURCES.countDocuments({ status: "completed", priority: 3 });
     const cWorks = await NEEDED_RESOURCES.countDocuments({ status: "completed", priority: 4 });
     const dWorks = await NEEDED_RESOURCES.countDocuments({ status: "completed", priority: 5 });
     const eWorks = await NEEDED_RESOURCES.countDocuments({ status: "completed", priority: 6 });
     const classWorks = {
         S: sWorks,
         A: aWorks ,
         B: bWorks ,
         C: cWorks ,
         D: dWorks ,
         E: eWorks 
     };
 
     res.json(classWorks);
 
    }catch(error){
      res.json(error);
    }
});

 router.get("/getallclassworks",async(req,res)=>{
    try{
     const sWorks = await NEEDED_RESOURCES.countDocuments({   priority: 1 });
     const aWorks = await NEEDED_RESOURCES.countDocuments({   priority: 2 });
     const bWorks = await NEEDED_RESOURCES.countDocuments({   priority: 3 });
     const cWorks = await NEEDED_RESOURCES.countDocuments({   priority: 4 });
     const dWorks = await NEEDED_RESOURCES.countDocuments({   priority: 5 });
     const eWorks = await NEEDED_RESOURCES.countDocuments({   priority: 6 });
     const classWorks = {
         S: sWorks,
         A: aWorks ,
         B: bWorks ,
         C: cWorks ,
         D: dWorks ,
         E: eWorks 
     };
 
     res.json(classWorks);
 
    }catch(error){
      res.json(error);
    }
});

 router.get('/utilizationStatistics', async (req, res) => {
    try {
      const utilizationData = await NEEDED_RESOURCES.find({status:"completed"});
      let resourceCounts = [];
utilizationData.forEach(resource => {
    resourceCounts.push({
        resourceType: "Workers",
        count: resource.Workers
    });
    resourceCounts.push({
        resourceType: "Civil Engineers",
        count: resource.Civil_Engineers
    });
    resourceCounts.push({ 
        resourceType: "Site Supervisors",
        count: resource.Site_Supervisors
    });
    resourceCounts.push({
        resourceType: "Asphalt",
        count: resource.Asphalt_in_kg
    });
    resourceCounts.push({
        resourceType: "Concrete",
        count: resource.Concrete_in_kg
    });
    resourceCounts.push({
        resourceType: "Gravel",
        count: resource.Gravel_in_kg
    });
    resourceCounts.push({
        resourceType: "Road Rollers",
        count: resource.Road_Roller
    });
    resourceCounts.push({
        resourceType: "Excavators",
        count: resource.Excavators
    });
    resourceCounts.push({
        resourceType: "Dump Trucks",
        count: resource.Dump_Trucks
    });
});

// Now you have an array containing resource counts
// Send it with the response
res.json(resourceCounts);
    } catch (error) {
      console.error('Error fetching utilization statistics:', error);
      res.status(500).json({ error: 'Failed to fetch utilization statistics' });
    }
});

router.get('/suburbdetails', async (req, res) => {
    const { suburb } = req.query;
    try {
        const supervisors = await user.find({ position: 'supervisor', suburb: suburb });
        const clerks = await user.find({ position: 'clerk', suburb: suburb });
        const suburbDetails = {
            supervisor: supervisors,
            clerk: clerks
        };

        res.json(suburbDetails); 
    } catch (err) {
        console.log(err);
        console.log("Error in fetching supervisor and clerk");
        res.status(500).json({ error: "Error in fetching supervisor and clerk" }); 
    }
});

const upload = multer({ 
    dest: '../frontend/public/' ,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}); 


const jsonParser = bodyParser.json({ limit: '100mb' });

router.post('/uploadphoto', upload.single('myfile'), jsonParser, async (req, res) => {
    const { UserID } = req.body;
    const myfile = req.file; 
    if (!myfile) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const destinationPath = path.join(__dirname, '../../frontend/public', UserID + path.extname(myfile.originalname)); 
        fs.renameSync(myfile.path, destinationPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC);
        
        res.status(200).json({ message: "File uploaded successfully", filename: UserID });
    } catch (err) {
        console.error("Error moving file:", err);
        res.status(500).json({ error: "Failed to upload photo" });
    }
});


const fs2 = require('fs').promises;

router.get('/getUserProfilePic', async (req, res) => {
    const { userid } = req.query;
    
    try {
        const extensions = ['jpg', 'jpeg', 'png'];
        let profilePicUrl = '';

        for (const ext of extensions) {
            const imagePath = path.join(__dirname, '../../frontend', 'public', `${userid}.${ext}`);
            const exists = await fileExists(imagePath);

            if (exists) {
                profilePicUrl = `./${userid}.${ext}`;
                break;
            }
        }

        res.json({ profilePicUrl });
    } catch (error) {
        console.error("Error fetching user profile picture:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function fileExists(filePath) {
    try {
        await fs2.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

router.get('/new_complaints',async(req,res)=>{
    const {suburb}=req.query;
    try{
        const count = await COMPLAINT.countDocuments({ suburb: suburb, status: "new" });
        res.json({ count: count });
    }catch(error){
        console.error("Error fetching new complaints:", error,count);
        res.status(500).json({ error: "Internal server error" });
        }
});

router.get('/workstatus',async(req,res)=>{
   try{
    const completedworks=await COMPLAINT.countDocuments({status:"completed"});
    const complaints=await COMPLAINT.countDocuments();
    const pendingworks=await COMPLAINT.countDocuments({status:"pending"});
    const ongoing=await COMPLAINT.countDocuments({status:"ongoing"});
    res.json({completedworks:completedworks,complaints:complaints,pendingworks:pendingworks,ongoing:ongoing});
   }catch(error){
    console.error("Error fetching nwork status:", error,count);
        res.status(500).json({ error: "Internal server error" });
   }
});

module.exports = router;

