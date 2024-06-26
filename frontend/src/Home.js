import React, { useState , useEffect} from "react";

const Home = () => {
  const [data, setData] = useState([]);
  const suburbs = ["Area 1", "Area 2", "Area 3","Area 4","Area 5","Area 6"];
  const fetchData = async (suburb) => {
    try {
      const response = await fetch(`http://localhost:5000/suburbdetails?suburb=${suburb}`);
      const jsonData = await response.json();
      return {suburb:suburb,supervisor:jsonData.supervisor,clerk:jsonData.clerk};
    } catch (error) {
      console.error(`Error fetching data for ${suburb}:`, error);
      return { suburb: suburb, supervisor: [], clerk: [] }; 
    }
  };
  useEffect(() => {
    fetchDataForAllSuburbs();
  }, [fetchData]);
  const fetchDataForAllSuburbs = async () => {
    try {
      const suburbDataArray = await Promise.all(suburbs.map(suburb => fetchData(suburb)));
      setData(suburbDataArray);
      console.log(suburbDataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const imageExists = async(url) => {
    const img = new Image();
    img.src = url;
    return img.complete || (img.width + img.height) > 0;
  };
  let counter=0;
    return (
      <div className='Hero'>
      <div className='page-container'>
        
      <div className="Complaints_container">
      <h4 className="Home_text" >Welcome to the Road Repair App</h4>
      <h2 className="Home_text">Hyderabad city</h2>
      <div className="Supervisor_container">
        
        
      {data.map(suburbData => (
          <div key={suburbData.suburb} className="Home_Container">
              
            {suburbData.supervisor.map(supervisor => (
                <div className="supervisor_row">
                  
                  <div className="profilepi">
                  <h2> {suburbData.suburb}</h2>
                  {imageExists(`./22SP200${++counter}.jpeg`) ? (
                    <img src={`./22SP200${counter}.jpeg`} alt="profile" />
                 ) : (
                   <img src={`./profile.png`} alt="Placeholder" />
                          )}
                   <h3>Supervisor</h3>
                  </div>
                  <div className="details">
                      <div className="details_">Name: {supervisor.name}</div>
                    <div className="details_">For complaints Contact:{suburbData.clerk.map(clerk => (
                      <div> {clerk.phoneno} </div>
                      ))}</div>
                    </div>
                </div>
              ))}
            </div>
        ))}
      </div>
      </div>
      </div>
      </div>
    );
  }

export default Home;