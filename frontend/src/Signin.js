import React,{useState ,useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import {LoginContext} from './Contexts/LoginContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin= () =>{
  const [username, setUsername] = useState('');
  const [passw, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setIssignin } = useContext(LoginContext);
  const { setIsJustSignedIn } = useContext(LoginContext);
  const { isLoggedout , setIsLoggedout } = useContext(LoginContext);
  const history = useHistory();

  const notifyA = () => toast.error("Signin Failed", {
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

  const notifyB = () =>{ 
    if(isLoggedout) {
      toast.info("Logged out", {
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
  setIsLoggedout(false);
}
  
  useEffect(()=>{
    notifyB();
  },[])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Make your fetch request here instead of Axios
      const response = await fetch('http://localhost:5000/sign__in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ UserID: username, password: passw })
      });
      const data = await response.json();
  
      if (data.error) {
        notifyA();
        setError(data.error);
      } else {
        // await notifyB(); // Wait for the toast to show
  
        setIssignin(true);
        setIsJustSignedIn(true);
        localStorage.setItem('issignin', true);
  
        if (data.savedUser.position === "clerk") {
          history.push({
            pathname: "/Clerk_Home",
            state: { user: data.savedUser }
          });
        } else if (data.savedUser.position === "supervisor") {
          history.push({
            pathname: "/Supervisor",
            state: { user: data.savedUser }
          });
        } else if (data.savedUser.position === "administrator") {
          history.push({
            pathname: "/Administrator_Home",
            state: { user: data.savedUser }
          });
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An unexpected error occurred. Please try again later.");
      notifyA();
    }
  };
  
    return (
        
      <div className="Signin">
        <form className="form" onSubmit={handleSubmit}>
          <h1 >SIGN IN</h1>
          {error && ( <div className="error_signin ">{error}</div>)}
          <div className="inputs">
            <div className="input">
              <img src="./person.png" alt=" "></img>
            <input type="text" name="UserID" id="UserID" placeholder="UserID" required
             value={username}  onChange={(e)=> setUsername(e.target.value)} />
            </div>
            <div className="input">
              <img src="./password.png" alt=" "></img>
            < input type="password"
              name="password"
              id="password"
              placeholder="Password"
              required value={passw}  onChange={(e)=> setPassword(e.target.value)}/>
              </div>
          </div>
           <button className="submitbutton" type="submit"> Submit</button>
        </form>
        {/* <ToastContainer position="bottom-left"/> */}
      </div>
    );
};

export default  Signin;


