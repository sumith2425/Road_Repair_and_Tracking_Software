import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const Add_Clerk = () => {
  const location = useLocation();
  const history = useHistory();
  const user = location.state && location.state.user;
  const [password, setPassword] = useState('');
  const [currpassword, setCurrpassword] = useState('');
  const [UserID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [error, setError] = useState(false);
  const [editpwd, setIseditpwd] = useState(false);
  const [verifypwd, setVerifypwd] = useState(false);

  const handlechangepwd = () => {
    if(!editpwd) setIseditpwd(true);
  };

  const handleverifypwd = () => {
    if(currpassword === user.password){
      setVerifypwd(true);
      if(error) setError(false);
    } else {
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/add_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ UserID: UserID, password: password,name:name,phoneno:phoneno,suburb:user.suburb,city:user.city,position:"clerk"})
      });  
      const data = await response.json();   
      if (response.ok) {
        Swal.fire({
            title: "Added!",
            text: "Clerk successfully added.",
            icon: "success"
          });
        console.log(data);
        history.push({
          pathname: "/Supervisor",
          state: { user: data }
        });
      } else {
        console.log(data.error); 
        Swal.fire({
          title: "Error!",
          text: "The UserID already exists.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error:", error); 
    }
  };

  return(
    <div className="background-image11">
      <div className="page-container1">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <h3>Create Account</h3>
            <div className="form-group">
              <div className="label-input">
                <label>UserID:</label>
                <input
                  type="text"
                  placeholder="UserID"
                  value={UserID}
                  onChange={(event) => setUserID(event.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="label-input">
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="label-input">
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="label-input">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  pattern="[0-9]{10}"
                  value={phoneno}
                  onChange={(event) => setPhoneno(event.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            {error && (<p className="error-message">Error: Unable to sign up.</p>)}
            <button className="submit-button" type="submit" >Add Clerk</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add_Clerk;
