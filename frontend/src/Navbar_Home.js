import React,{useState,useEffect} from 'react';
import {Link,useLocation} from 'react-router-dom';
const Navbar = () => {
  
    return(

        <nav className='Navbar'>
          <h1>Public Works Department</h1>
          <div className="links">
          <Link to="/" className="link">Home</Link>
          <Link to="/Signin" className="link">Sign In</Link>
          </div>
        </nav>
    );
};

export default Navbar;