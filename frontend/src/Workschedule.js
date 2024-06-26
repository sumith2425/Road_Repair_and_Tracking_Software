import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';

const Work_schedule = () => {
  const location = useLocation();
  const user = location.state ? location.state.user : null;
  const [data, setData] = useState([]);
  const [flag,setFlag]=useState(false);
  const [complaint, setComplaint] = useState([]);

  const getClassByStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'completed'; // CSS class for completed status (green background)
      case 'ongoing':
        return 'ongoing'; // CSS class for ongoing status (yellow background)
      case 'pending':
        return 'pending'; // CSS class for pending status (white background)
      default:
        return ''; // Default class if status is not recognized
    }
  };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/allcomplaints?suburb=${user.suburb}&city=${user.city}&status=${"ongoing"}`);
            const jsonData = await response.json();
            setComplaint(jsonData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, [flag]);
  useEffect(() => {
    console.log(user.suburb,user.city);
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workschedule?suburb=${user.suburb}&city=${user.city}&status=ongoing`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handle_completed = async (index) => {
    // setFlag(!flag)
    const needed_resources = complaint[index];
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async(result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Completed!",
          text: "Complaint has been marked Completed.",
          icon: "success"
          
        });
    try {
      console.log(needed_resources._id);
      const response = await fetch(`http://localhost:5000/workschedulecomplete?id=${needed_resources._id}`);
      setFlag(prevFlag => !prevFlag);

    } catch (error) {
      console.error("Error completing work:", error);
    }
  }
  });
  };
  

  return (
    <div className="background-image">
    <div className="page-container">
    <div className="Complaints_container">
      <div className="Complaints_form">
        <h1>Work_schedule </h1>
        {complaint.map((jsonData, index) => (
          <div key={index} className="Complaint_content">
            <div className="rowtexts">
            <div className="text"><img src = './Problem_logo.png' alt="" /><div className="sidelabel">Problem :</div> <div className="maintext">{jsonData.Problem}</div></div>
              <button  className="completedbutton" onClick={() => handle_completed(index)}>Work Completed</button>
            
            </div>
            <div className="rowtexts" >
                <div className="text"><div className="sidelabel"></div> <div className="maintext"></div></div>
            
              <Link to={{ pathname: "/Edit_Data_form", state: { complaint: jsonData, user: user } }}>
              <p className="Edit_data">Edit Resources</p>
            </Link>
            </div>
              <div className="rowtexts">
              <div className="text"><img src = './Address_logo.png' alt="" /><div className="sidelabel">Address :</div><div className="maintext"> {jsonData.Address}</div></div>
              <div className="text"><img src = './Status_logo.png' alt="" /><div className="sidelabel">Status :</div><div className={`maintext_${getClassByStatus(jsonData.status)}`}>{jsonData.status}</div></div>
              </div>
                
    
          </div>
        ))}
      </div>
      </div>
    </div>
    </div>
  );
};

export default Work_schedule;


