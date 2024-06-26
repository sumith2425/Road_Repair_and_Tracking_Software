import React, { useState, useEffect, useContext} from "react";
import {LoginContext} from './Contexts/LoginContext';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Clerk_Home = () => {
  const location = useLocation();
  const user = location.state ? location.state.user : null;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isJustSignedIn,setIsJustSignedIn } = useContext(LoginContext);
  const { isclerk_Complaint , setIsclerk_Complaint } = useContext(LoginContext);
  const { isProfileEdited , setIsProfileEdited } = useContext(LoginContext);

  const notifyA = () => {
    if(isclerk_Complaint){
    toast.success("Complaint Added Successfully", {
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
    setIsclerk_Complaint(false)
  }

  const notifyB = () => {
    if (!isLoading && isJustSignedIn) {
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
    notifyA();
    notifyB();
    notifyC();
  },[])

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
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/allcomplaints?suburb=${user.suburb}&city=${user.city}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const showNotification = localStorage.getItem('showNotification');
    if (showNotification === 'true') {
      toast.success("Complaint Successfully added.");
      // Clear the flag from local storage after showing the notification
      localStorage.removeItem('showNotification');
    }
  }, []);

  const handleDelete = async (complaintId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Complaint has been deleted.",
          icon: "success"
          
        });
        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:5000/deletecomplaint/${complaintId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to delete complaint');
          }
          setData(data.filter(complaint => complaint._id !== complaintId));
        } catch (error) {
          setError(error.message);
        }
        setIsLoading(false);
      }
    });
    
  };
  
  return (
    <div className="background-image_clerk">
    <div className="page-container">
    <div className="Clerkhome">
      <nav className="somebar">
        <h2>Welcome {user.name}</h2>
        <div className="extralinks">
          <Link to={{ pathname: "/Clerk_Complaint", state: { user: user } }} className='submitbutton Add_complaint'>+Complaint</Link>
        </div>
      </nav>
        <div className="Complaints_form">
          <h1>All complaints</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            data.map((jsonData, index) => (
              <div key={index} className="Complaint_content">
                <div className="texts">
                  <div className="rowtexts">
                  <div className="text">
                      <img src = './Problem_logo.png' alt="" />
                      <div className="sidelabel">Problem :</div>
                      <div className="maintext"> {jsonData.Problem}</div>
                    </div>
                    {jsonData.status === "new" && (
                      
                      <button className="delete-button" onClick={() => handleDelete(jsonData._id)}>Delete</button>
                       
                    )}
                  </div>
                  <div className="rowtexts">
                    <div className="text">
                    <img src = './Address_logo.png' alt="" />
                      <div className="sidelabel">Address :</div>
                      <div className="maintext"> {jsonData.Address}</div>
                    </div>
                    <div className="text">
                    <img src = './Status_logo.png' alt="" />
                      <div className="sidelabel">Status :</div>
                      <div className={`maintext_${getClassByStatus(jsonData.status)}`}>{jsonData.status}</div>

                    </div>
                    {/* Render delete button for each complaint */}
                    
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
         <ToastContainer position="bottom-left"/> 
    </div>
  );
}

export default Clerk_Home;
