import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import {Link} from 'react-router-dom';

const Pending_Complaints=()=>{
    const location = useLocation();
    const user = location.state ? location.state.user : null;
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/allcomplaints?suburb=${user.suburb}&city=${user.city}&status=${"pending"}`);
            const jsonData = await response.json();
            setData(jsonData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, []);
      return (
        
    <div className="background-image">
    <div className="page-container">
        <div className="Complaints_container">
          <div className="Complaints_form">
              <h1>Pending Works </h1>
              {data.map((jsonData,index) => (
              <div key={index} className="Complaint_content">
                <div className="rowtexts">
            <div className="text"><img src = './Problem_logo.png' alt="" /><div className="sidelabel">Problem: </div> <div className="maintext">{jsonData.Problem}</div></div>
            <Link to={{ pathname: "/Edit_Data_form", state: { complaint: jsonData, user: user } }}>
              <p className="Edit_data">Edit Resources</p>
            </Link>
            </div>
              <div className="rowtexts">
              <div className="text"><img src = './Address_logo.png' alt="" /><div className="sidelabel">Address: </div><div className="maintext"> {jsonData.Address}</div></div>
              </div>
              </div>
            )
            )}
            </div>
        </div>
        </div>
        </div>
      );
};

export default Pending_Complaints;