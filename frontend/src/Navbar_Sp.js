import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { LoginContext } from './Contexts/LoginContext';

const Navbar_Sp = () => {
    const location = useLocation();
    const history = useHistory();
    const user = location.state ? location.state.user : null;
    const { setIssignin } = useContext(LoginContext);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showComplaintDropdown, setShowComplaintDropdown] = useState(false);
    const profileDropdownRef = useRef(null);
    const complaintDropdownRef = useRef(null);
    const [newdata,setNewdata]=useState(0);

    const {setIsLoggedout} = useContext(LoginContext);

    const handleLogout = () => {
        setIssignin(false);
        setShowProfileDropdown(false);
        localStorage.setItem('issignin', false);
        setIsLoggedout(true);
        history.push('/Signin');
        console.log("Logged out");
    };

    const getnewcompaints=async()=>{
        try{
       const response=await fetch(`http://localhost:5000/new_complaints?suburb=${user.suburb}`);
       const jsonData = await response.json();
       setNewdata(jsonData.count);
    }catch(error){
        console.log(error);
        console.log("getting new complainta failed");
    }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (complaintDropdownRef.current && !complaintDropdownRef.current.contains(event.target)) {
                setShowComplaintDropdown(false);
            }
            getnewcompaints();
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
        setShowComplaintDropdown(false);
    };

    const toggleComplaintDropdown = () => {
        setShowComplaintDropdown(!showComplaintDropdown);
        setShowProfileDropdown(false);
    };

    return (
        <nav className="Navbar">
            <h1>Public Works Department</h1>
            <div className="links">
                <Link to={{ pathname: "/Supervisor", state: { user: user } }} className="link" >Home</Link>
                <Link to={{ pathname: "/Work_schedule", state: { user: user } }} className="link" >Work Schedule</Link>
                <Link to={{ pathname: "/Add_Clerk", state: { user: user } }} className="link" >Add Clerk</Link>

                <div className="dropdown-container" ref={complaintDropdownRef}>
                    <div className="link" onClick={toggleComplaintDropdown}>Complaints<span className="arrow-down"></span></div>
                    {showComplaintDropdown && (
                        <div className="dropdown-content">
                            <Link to={{ pathname: "/Complaints", state: { user: user } }} className="link" onClick={toggleComplaintDropdown}>
                                  New    <span style={{backgroundColor: 'red',  width:'20px',height:'20px', padding: '0.2em 0.5em', margin:'0 2.2rem', borderRadius: '10px', fontSize:'15px' }}>{newdata}</span>
                                </Link>
                            <Link to={{ pathname: "/Pending_Complaints", state: { user: user } }} className="link" onClick={toggleComplaintDropdown}>Pending</Link>
                            <Link to={{ pathname: "/Completed_works", state: { user: user } }} className="link" onClick={toggleComplaintDropdown}>Completed</Link>
                        </div>
                    )}
                </div>

                <div className="dropdown-container" ref={profileDropdownRef}>
                    <div className="link" onClick={toggleProfileDropdown} >Profile<span className="arrow-down"></span></div>
                    {showProfileDropdown && (
                        <ul className="dropdown-content">
                            
                            <Link to={{ pathname: "/Edit_Supervisor", state: { user: user } }} className='link' onClick={toggleProfileDropdown}><img src="./edit_profile.png" alt=" "></img>Edit Profile</Link>
                            <div className="link" onClick={handleLogout} ><img src="./logout.png" alt=" " ></img>Log out</div>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar_Sp;
