import React, { useState, useEffect,useContext  } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import {LoginContext} from './Contexts/LoginContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Administrator_Home = () => {
  const location = useLocation();
  const user = location.state ? location.state.user : null;
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState({}); 
  const [isPending,setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const { isJustSignedIn,setIsJustSignedIn } = useContext(LoginContext);
  const { isProfileEdited , setIsProfileEdited } = useContext(LoginContext);

  const notifyB = () => {
    if (isJustSignedIn) {
      toast.success("SignedIn Successfully", {
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#ffffff",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        },
        autoClose: 1500,
      });
    }
      setIsJustSignedIn(false);
    }; 

    const notifyC = () => {
      if (isProfileEdited) {
        toast.success("Updated Profile Successfully", {
          style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          },
          autoClose: 1500,
        });
      }
        setIsProfileEdited(false);
      };

  useEffect(()=>{
    notifyB();
    notifyC();
  },[])

  const update_workschedule=async()=>{
    Swal.fire({
      title: "Are you sure,",
      text: "You want to change the Work schedule?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Updated!",
          text: "Work Schedule has been updated.",
          icon: "success",
          showConfirmButton: false,
        });
        try{
          setIsPending(true)
          console.log("updating work_schedule");
          const response = await fetch(`http://localhost:5000/update_work_schedule`);
          console.log("work_scheduleupdated",response);
          setIsPending(false);
          window.location.reload();
         }catch(error){
          console.error("Error fetching data:", error);
         }
      }
    });
    
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("start")
        const response = await fetch(`http://localhost:5000/allresources?status=${"ongoing"}`);
        const jsonData = await response.json();
        console.log(jsonData)

        // Fetch additional data for each complaint
        const complaintDataPromises = jsonData.map(item => {
          return Promise.all([
            GetComplaintProblem(item.complaint_id),
            GetComplaintAddress(item.complaint_id),
            
          ]).then(([problem, address]) => {
            return { ...item, problem, address };
          });
        });

        Promise.all(complaintDataPromises)
          .then(complaints => {
            setData(complaints);
          })
          .catch(error => {
            console.error('Error fetching complaint data:', error);
          });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    setIsLoading(false);
    };

    fetchData();
  }, []);

  function GetComplaintProblem(complaint_id) {
    console.log(complaint_id)
    
    setIsLoading(true);
    return fetch(`http://localhost:5000/getcomplaint?complaint_id=${complaint_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          console.log(error)
          return null;
        } else {
          console.log(data)
          return data.Problem;
          
        }
        
      });
  }

  function GetComplaintAddress(complaint_id) {
    console.log(complaint_id)
    
    setIsLoading(true);
    return fetch(`http://localhost:5000/getcomplaint?complaint_id=${complaint_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          console.log(error)
          return null;
        } else {
          console.log(data)
          return data.Address;
        }
        
      });
  }
  const toggleItemExpansion = (index) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [index]: !prevState[index] // Toggle expansion state for the given index
    }));
  };

  return (
    <div className="background-image_admin">
    <div className="page-container">
    <div className="Clerkhome">
        <div className="Complaints_form">
          <div className="admin_home_header">
            <div></div>
            <div className="">
            <h1 >Ongoing Works</h1>
            </div>
            {!isPending && (<button className="updatebutton" onClick={update_workschedule}>Update Work Schedule</button>)}
            {isPending && (<button className="updatebutton" onClick={update_workschedule}>Updating.........</button>)}
          </div>
          {/* <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Collapse Details' : 'Expand Details'}
          </button> */}
          
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) :( data && data.map((item, index) => (
            <div key={index} className="Complaint_content">
                <div className="rowtexts">
                  <div className="text">
                    <div className="sidelabel">Problem :</div>
                    <div className="maintext">{item.problem}</div>
                  </div>
                  <div className="text">
                    <div className="sidelabel">Address :</div>
                    <div className="maintext"> {item.address}</div>
                  </div>
                </div>
                <button className="expand-button" onClick={() => toggleItemExpansion(index)}>
                  {expandedItems[index] ? 'Collapse Details' : 'Expand Details'}
                </button>
                <div className="expandedform"style={{ display: expandedItems[index] ? '' : 'none' }}> 
                <div className="expandedformtext">
                  <div className="sidelabel">Time:</div>
                  <div className="maintext">{item.time}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Workers:</div>
                  <div className="maintext">{item.Workers}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Civil Engineers:</div>
                  <div className="maintext">{item.Civil_Engineers}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Site Supervisors:</div>
                  <div className="maintext">{item.Site_Supervisors}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Asphalt (kg):</div>
                  <div className="maintext">{item.Asphalt_in_kg}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Concrete (kg):</div>
                  <div className="maintext">{item.Concrete_in_kg}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Gravel (kg):</div>
                  <div className="maintext">{item.Gravel_in_kg}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Road Roller:</div>
                  <div className="maintext">{item.Road_Roller}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Excavators:</div>
                  <div className="maintext">{item.Excavators}</div>
                </div>
                <div className="expandedformtext">
                  <div className="sidelabel">Dump Trucks:</div>
                  <div className="maintext">{item.Dump_Trucks}</div>
                </div>
                </div>
              </div>
          )
          ))}
        </div>
      </div>
      </div>
    <ToastContainer position="bottom-left"/>
    </div>
  );
}

export default Administrator_Home;