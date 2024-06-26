import React, { useState,useEffect} from 'react';
import { useHistory ,useLocation} from 'react-router-dom';
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom';

const Edit_Data_form = () => {
  const history=useHistory();
  const location=useLocation();
  const user = location.state ? location.state.user : null;
  const comp = location.state ? location.state.complaint : null;

    const [data,setData] = useState(0);
    const [priority,setPriority] = useState(0);
    const [time,setTime] = useState(0);
    const [Workers,setWorkers] = useState(0);
    const [Civil_Engineers,setCivil_Engineers] = useState(0);
    const [Site_Supervisors,setSite_Supervisors] = useState(0);
    const [Asphalt_in_kg,setAsphalt_in_kg] = useState(0);
    const [Concrete_in_kg,setConcrete_in_kg] = useState(0);
    const [Gravel_in_kg,setGravel_in_kg] = useState(0);
    const [Road_Roller,setRoad_Roller] = useState(0);
    const [Excavators,setExcavators] = useState(0);
    const [Dump_Trucks,setDump_Trucks] = useState(0);
    
    useEffect(() => {
        console.log(user.suburb,user.city,comp.Problem)
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/get_data_form?complaint_id=${comp._id}`);
            const jsonData = await response.json();
            setData(jsonData);
            setWorkers(jsonData.Workers);
            setPriority(jsonData.priority);
            setTime(jsonData.time);
            setCivil_Engineers(jsonData.Civil_Engineers);
            setSite_Supervisors(jsonData.Site_Supervisors);
            setAsphalt_in_kg(jsonData.Asphalt_in_kg);
            setConcrete_in_kg(jsonData.Concrete_in_kg);
            setGravel_in_kg(jsonData.Gravel_in_kg);
            setRoad_Roller(jsonData.Road_Roller);
            setExcavators(jsonData.Excavators);
            setDump_Trucks(jsonData.Dump_Trucks);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(comp._id);
        try {
          const response = await fetch('http://localhost:5000/edit_data_post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                complaint_id:comp._id,
                priority:priority,
                time:time,
                Workers:Workers,
                Civil_Engineers:Civil_Engineers,
                Site_Supervisors:Site_Supervisors,
                Asphalt_in_kg:Asphalt_in_kg,
                Concrete_in_kg:Concrete_in_kg,
                Gravel_in_kg:Gravel_in_kg,
                Road_Roller:Road_Roller,
                Excavators:Excavators,
                Dump_Trucks:Dump_Trucks
            })
          });
          
          if (!response.ok) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            throw new Error('Failed to submit complaint');
          }
          const responseData = await response.json();
          Swal.fire({
            icon: "success",
            title: "Resources Updated Sccessfully",
            showConfirmButton: false,
            timer: 1500
          });
          console.log("Helllllo")
            history.push({
            pathname:"/Work_schedule",
            state: {user:user}
        });
        } catch (error) {
          console.error('Error submitting complaint:', error);
        }
      };
    return (
      <div className="background-image">
      <div className="page-container">
      <div className="Data_form">
            <h1>Enter Needed Resources:</h1>
            <form className="Data_form_Update" onSubmit={handleSubmit}>
             
            <label>Number of Workers:</label>
            <input type="Number" name="Workers" value = {Workers} min={0} onChange={(e)=>setWorkers(e.target.value)} />
          
            <label>Number of Civil Engineers:</label>
            <input type="Number" name="Civil_Engineers" value = {Civil_Engineers} min={0} onChange={(e)=>setCivil_Engineers(e.target.value)} />
            <label>Number of Site Supervisors:</label>
            <input type="Number" name="Site_Supervisors" value = {Site_Supervisors} min={0} onChange={(e)=>setSite_Supervisors(e.target.value)} />
            <label>Asphalt in kg:</label>
            <input type="Number" name="Asphalt_in_kg" value = {Asphalt_in_kg} min={0} onChange={(e)=>setAsphalt_in_kg(e.target.value)} />
            <label>Concrete in kg:</label>
            <input type="Number" name="Concrete_in_kg" value = {Concrete_in_kg} min={0} onChange={(e)=>setConcrete_in_kg(e.target.value)} />
            <label>Gravel in kg:</label>
            <input type="Number" name="Gravel_in_kg" value = {Gravel_in_kg} min={0} onChange={(e)=>setGravel_in_kg(e.target.value)} />
            <label>No. of Road Rollers:</label>
            <input type="Number" name="Road_Roller" value = {Road_Roller} min={0} onChange={(e)=>setRoad_Roller(e.target.value)} />
            <label>No. of Excavators:</label>
            <input type="Number" name="Excavators" value = {Excavators} min={0} onChange={(e)=>setExcavators(e.target.value)} />
            <label>No. of Dump Trucks:</label>
            <input type="Number" name="Dump_Trucks" value = {Dump_Trucks} min={0} onChange={(e)=>setDump_Trucks(e.target.value)} />
            <label>Estimated Time:</label>
            <input type="Number" name="time" value = {time} min={0} onChange={(e)=>setTime(e.target.value)} />
            <label>Priority:</label>
            <select name="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="0">Select Option</option>
              <option value="1">S</option>
              <option value="2">A</option>
              <option value="3">B</option>
              <option value="4">C</option>
              <option value="5">D</option>
              <option value="6">E</option>
           </select>
           <button className='update111button' type ='submit'>Submit </button>
        </form>
            </div>
            </div>
            </div>
    );
    };


export default Edit_Data_form;

