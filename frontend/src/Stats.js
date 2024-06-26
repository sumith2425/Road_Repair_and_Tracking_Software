import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const Stats = () => {
    const [completedClassWorks, setCompletedClassWorks] = useState(null);
    const [classWorks, setClassWorks] = useState(null);
    const [utilizationData, setUtilizationData] = useState(null);
    const [completedworks,setCompletedWorks]=useState(0);
    const [complaints,setComplaints]=useState(0);
    const [pendingworks,setPendingworks]=useState(0);
    const [ongoing,setOngoing]=useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const completedResponse = await fetch("http://localhost:5000/getcompletedclassworks");
                const completedData = await completedResponse.json();
                setCompletedClassWorks(completedData);

                const allWorksResponse = await fetch("http://localhost:5000/getallclassworks");
                const allWorksData = await allWorksResponse.json();
                setClassWorks(allWorksData);

                const utilizationResponse = await fetch("http://localhost:5000/utilizationStatistics");
                const utilizationData = await utilizationResponse.json();
                setUtilizationData(utilizationData);
               
                const workstatus=await fetch("http://localhost:5000/workstatus");
                const data=await workstatus.json();
                console.log(data);
               setCompletedWorks(data.completedworks);
               setComplaints(data.complaints);
               setPendingworks(data.pendingworks);
               setOngoing(data.ongoing);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        
    }, []);

    const completedOptions = { labels: completedClassWorks ? Object.keys(completedClassWorks) : [] };
    const completedSeries = completedClassWorks ? Object.values(completedClassWorks) : [];

    const allWorksOptions = { labels: classWorks ? Object.keys(classWorks) : [] };
    const allWorksSeries = classWorks ? Object.values(classWorks) : [];

    const utilizationLabels = utilizationData && utilizationData.map(item => item.resourceType);
    const utilizationCounts = utilizationData && utilizationData.map(item => item.count);

    const utilizationOptions = {
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: utilizationLabels,
        },
    };

    const utilizationSeries = [
        {
            name: "Resource Counts",
            data: utilizationCounts,
        },
    ];

    return (
        <div className="background-image_none">
        <div className="page-container">
        <div className="stats_container">
            <div className="stat">
                <h2>All Works by Priority Level</h2>
                {classWorks && (
                    <ApexCharts options={allWorksOptions} series={allWorksSeries} type="pie" width={500} />
                )}
            </div>
            <div className="stat">
                <h2>Completed Works by Priority Level</h2>
                {completedClassWorks && (
                    <ApexCharts options={completedOptions} series={completedSeries} type="pie" width={500} />
                )}
            </div>
            <div className="stat">
                <h2>Resources Taken </h2>
                {utilizationData && (
                    <ApexCharts options={utilizationOptions} series={utilizationSeries} type="bar" width={1000} />
                )}
            </div>
            
              <div className="workstatus">
              <h2>Work Status:</h2>
                 <table>
                 <tr>
                <th>Total Complaints Received</th>
                <td>{complaints}</td>
                </tr>
                <tr>
               <th>Total Works Done</th>
               <td>{completedworks}</td>
               </tr>
              <tr>
              <th>Pending Works</th>
              <td>{pendingworks}</td>
              </tr>
              <tr>
              <th>Ongoing Works</th>
              <td>{ongoing}</td>
              </tr>
              </table>
              </div>
        </div>
        </div>
        </div>
    );
};

export default Stats;
