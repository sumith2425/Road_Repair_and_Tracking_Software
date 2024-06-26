import React ,{useContext,useState,useEffect,useRef} from 'react'
import {Link ,useLocation,useHistory} from 'react-router-dom';
import {LoginContext} from './Contexts/LoginContext';

const Navbar_admin = () => {
    const location=useLocation();
    const history = useHistory();
    const user = location.state ? location.state.user : null;
    const { setIssignin } = useContext(LoginContext)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef(null);

    const {setIsLoggedout} = useContext(LoginContext);

    const handleLogout = () => {
        setIssignin(false);
        localStorage.setItem('issignin', false);
        setIsLoggedout(true);
        history.push('/Signin');
        console.log("Loggedout");
      };
      
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    return ( 
        <nav className="Navbar">
            <h1>Public Works Department</h1>
            <div className="links">
                <Link to={{ pathname: "/Administrator_Home", state: { user: user} }} className="link">Home</Link>
                <Link to={{ pathname: "/Admin_Pending", state: { user: user} }} className="link">Pending</Link>
                <Link to={{ pathname: "/Add_Supervisor", state: { user: user} }} className="link">Add Supervisor</Link>
                <Link to={{ pathname: "/Stats", state: { user: user} }} className='link'>Statistics</Link>
                <Link to={{ pathname: "/update_resources", state: { user : user} }}className="link">Update Resources</Link>
                <div className="dropdown-container" ref={profileDropdownRef}>
                    <div className="link" onClick={toggleProfileDropdown}>Profile<span className="arrow-down"></span></div>
                    {showProfileDropdown && (
                        <ul className="dropdown-content">
                            
                            <Link to={{ pathname: "/Edit_Administrator", state: { user: user } }} className='link'><img src="./edit_profile.png" alt=" "></img>Edit Profile</Link>
                            <div className="link" onClick={handleLogout}><img src="./logout.png" alt=" "></img>Log out</div>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
     );
}
 
export default Navbar_admin;