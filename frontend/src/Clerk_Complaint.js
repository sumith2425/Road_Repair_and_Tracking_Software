import React, { useState, useContext} from 'react';
import { useHistory ,useLocation} from 'react-router-dom';
import {LoginContext} from './Contexts/LoginContext';

const Clerk_Complaint=()=>{
  const loc=useLocation();
  const [location,setLocation]=useState('');
  const [complaint, setComplaint] = useState('');
  const [isfocus,setIsfocus] = useState(false);
  const [isfocus_comp,setIsfocus_comp] = useState(false);
  const history=useHistory();
  const user = loc.state && loc.state.user;

  const { setIsclerk_Complaint } = useContext(LoginContext);

  const handleFocus = () => {
    setIsfocus(true);
    if(!complaint)setIsfocus_comp(false);
  };
  const handleFocus_complaint = () => {
    setIsfocus_comp(true);
    if(!location)setIsfocus(false);
  };

  const handleSubmit = async (e) => {
    console.log("Button clicked");
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/complaint_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Address: location,
          Problem: complaint,
          suburb:user.suburb,
          city:user.city,
          status:"new"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }
      const responseData = await response.json();
      console.log(responseData);

    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
    localStorage.setItem('showNotification', 'true');

    setIsclerk_Complaint(true);

    history.push({
      pathname: "/Clerk_Home",
      state: { user: user},
    });
  };
    return(
      <div className='background-image_clerk'>
      <div className="page-container">
      <div className="Clerk_Complaint_Container">
        <form className='Clerk_Complaint_form' onSubmit={handleSubmit}>
          <h2>Complaint Form</h2>
          <div className="location">
              <input className={` ${isfocus ? 'input-focus':''}`} type="text" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={handleFocus}
              />
              <div className={`labelline ${isfocus ? 'labelline-focus':''}`}>
                Location
              </div>
          </div>
          <div className="Clerk_Complaint_box">
             <textarea
                className={` ${isfocus_comp ? 'textarea-complaint-focus':''}`}                  
                required
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                onFocus={handleFocus_complaint}
                ></textarea>
              <div className={`labelline-complaint ${isfocus_comp ? 'labelline-complaint-focus':''}`}>
                Complaint
              </div>
          </div>
         <button className='submitbutton' type ='submit'>Submit </button>
         </form>
      </div>
      </div>
      </div>);
}

export default Clerk_Complaint