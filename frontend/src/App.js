import React, { useState , useEffect ,} from "react";
import Navbar_Home from './Navbar_Home'
import Home from './Home'
import Signin from './Signin';
import Navbar_Clerk from "./Navbar_Clerk.js"
import Clerk_Home from './Clerk_Home'
import Clerk_Complaint from './Clerk_Complaint.js'
import Edit_User from './Edit_User';
import Navbar_Sp from './Navbar_Sp';
import Supervisor from './Supervisor_Home.js';
import { BrowserRouter as Router ,Route,Switch } from 'react-router-dom';
import Complaints from './Complaints';
import Data_form from './Data_form';
import {LoginContext} from './Contexts/LoginContext';
import Navigate_Signin from "./Navigate_Signin.js";
import Work_schedule from "./Workschedule.js";
import Edit_Data_form from "./Edit_Data_form.js";
import Completed_works from "./Completed_works.js";
import Add_Clerk from "./Add_Clerk.js";
import Add_Supervisor from "./Add_Supervisor.js";
import Pending_Complaints from "./Pending_Complaints.js";
import Administrator_Home from "./Administrator_Home.js";
import Admin_Pending from "./Admin_Pending.js";
import Navbar_admin from "./Navbar_admin.js";
import UpdateResources from "./UpdateResources.js";
import Stats from "./Stats.js";
function App() {
  
  const [issignin, setIssignin] = useState(() => {
    const storedLoginState = localStorage.getItem('issignin');
    return storedLoginState !== null ? JSON.parse(storedLoginState) : false;
  });

  const [isJustSignedIn , setIsJustSignedIn] = useState(false);
  const [isclerk_Complaint , setIsclerk_Complaint] = useState(false);
  const [isProfileEdited , setIsProfileEdited] = useState(false);
  const [isLoggedout , setIsLoggedout] = useState(false);

  // Update local storage whenever login state changes
  useEffect(() => {
    window.localStorage.setItem('issignin', JSON.stringify(issignin));
  }, [issignin]);


  return (
    <Router>
    <div className="App">
      <Switch>
        <Route exact path="/" >
          <Navbar_Home />
          <Home />
        </Route>
        <LoginContext.Provider value={{issignin,setIssignin,isJustSignedIn , setIsJustSignedIn,isLoggedout , setIsLoggedout}}>
        <Route path="/Signin" >
          <Navbar_Home />
          <Signin /> 
        </Route>
        </LoginContext.Provider>
      </Switch>

      <LoginContext.Provider value={{issignin,setIssignin,isJustSignedIn , setIsJustSignedIn, isclerk_Complaint , setIsclerk_Complaint,isProfileEdited , setIsProfileEdited,isLoggedout , setIsLoggedout}}>
      <Switch>
        <Route  path="/Clerk_Home" >
          {issignin ?
          <>
          <Navbar_Clerk  />
          <Clerk_Home  /> 
          </>
          : 
          <Navigate_Signin />  }
        </Route>
        <Route path="/Clerk_Complaint" >
          {issignin ?
          <>
          <Navbar_Clerk  />
          <Clerk_Complaint  />
          </>
          : 
          <Navigate_Signin /> }
        </Route>
        <Route path="/Edit_Clerk" >
          {issignin ?
          <>
          <Navbar_Clerk  />
          <Edit_User  /> 
          </>
          : 
          <Navigate_Signin />  }
        </Route>

      </Switch>

        <Switch>
          <Route  path="/Supervisor">
          {issignin ?
          <>
            <Navbar_Sp />
            <Supervisor />
          </>
          : 
          <Navigate_Signin />  }
          </Route>
          <Route path="/Edit_Supervisor" >
          {issignin ?
          <>
          <Navbar_Sp />
          <Edit_User />
          </>
          : 
          <Navigate_Signin />  }
        </Route>
          <Route  path="/Complaints">
          {issignin ?
          <>
            <Navbar_Sp />
            <Complaints />
          </>
          : 
          <Navigate_Signin />  }
          </Route>
          <Route  path="/Add_Clerk">
          {issignin ?
          <>
            <Navbar_Sp />
            <Add_Clerk />
          </>
          : 
          <Navigate_Signin />  }
          </Route>
          <Route path="/Data_Form">
            {issignin ?
            <>
            <Navbar_Sp />
            <Data_form />
            </>
            : 
            <Navigate_Signin />  }
          </Route>
            <Route path='/Work_schedule'>
            {issignin ?
              <>
              <Navbar_Sp/>
              <Work_schedule/>
              </>
              : 
              <Navigate_Signin />  }
            </Route>
            <Route path='/Edit_Data_form'>
            {issignin ?
              <>
              <Navbar_Sp/>
              <Edit_Data_form/>
              </>
              : 
              <Navigate_Signin />  }
            </Route>
            <Route path='/Pending_Complaints'>
            {issignin ?
              <>
               <Navbar_Sp/>
                <Pending_Complaints/>
              </>
              : 
              <Navigate_Signin />  }
            </Route>
            <Route path='/Completed_works'>
            {issignin ?
              <>
               <Navbar_Sp/>
                <Completed_works/>
              </>
              : 
              <Navigate_Signin />  }
            </Route>
      </Switch>

      <Switch>
          <Route  path="/Administrator_Home">
          {issignin ?
              <>
            <Navbar_admin />
            <Administrator_Home />
              </>
            : 
            <Navigate_Signin />  }
          </Route>
          <Route path="/Admin_Pending" >
          {issignin ?
              <>          
          <Navbar_admin />
          <Admin_Pending />
          </>
          : 
          <Navigate_Signin />  }
        </Route>
          <Route path="/Add_Supervisor" >
          {issignin ?
              <>          
          <Navbar_admin />
          <Add_Supervisor />
          </>
          : 
          <Navigate_Signin />  }
        </Route>
          <Route path="/Edit_Administrator" >
          {issignin ?
              <>          
          <Navbar_admin />
          <Edit_User />
          </>
          : 
          <Navigate_Signin />  }
        </Route>
          <Route  path="/update_resources">
          {issignin ?
            <> 
            <Navbar_admin />
            <UpdateResources />
            </>
            : 
            <Navigate_Signin />  }
          </Route>
          <Route  path="/Stats">
          {issignin ?
            <> 
            <Navbar_admin />
            <Stats />
            </>
            : 
            <Navigate_Signin />  }
          </Route>
      </Switch>
            
      </LoginContext.Provider>
    </div>
    </Router>
    
  );
}

export default App;


