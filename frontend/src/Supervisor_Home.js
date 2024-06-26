import React, { useEffect,useContext } from "react";
import { useLocation } from "react-router-dom";
import {LoginContext} from './Contexts/LoginContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Supervisor_Home = () => {
  const location = useLocation(); 
  const user = location.state ? location.state.user : null;

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

  return (
    <div className="Supervisor_Home">
      <div className="Supr_cont">
      <h1 style={{color:"black",fontSize:45}}>Welcome {user.name}</h1>
    </div>
    <ToastContainer position="bottom-left"/>
    </div>
  );
};

export default Supervisor_Home;


