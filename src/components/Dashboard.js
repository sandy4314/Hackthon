import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";  // Importing the CSS file

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Token missing.");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.length === 0) {
          setError("No complaints found.");
        } else {
          setComplaints(response.data);
        }
      } catch (err) {
        console.error("Error fetching complaints:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch complaints.");
      }
    };

    fetchComplaints();
  }, [token]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">User Dashboard</h2>
      {error && <p className="dashboard-error">{error}</p>}
      <div className="complaints-cards-container">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div className="complaint-card" key={complaint._id}>
              <div className="complaint-card-image">
                {complaint.imagePath ? (
                  <img
                    src={`http://localhost:5000${complaint.imagePath}`}
                    alt="Complaint"
                    className="complaint-image"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <div className="complaint-card-details">
              
                <p className="complaint-card-issue-value"><span className="complaint-card-issue">Issue Type</span>:{complaint.issueType}</p>
              
                <p className="complaint-card-description"><span className="complaint-card-description-heading">Description</span>:{complaint.description}</p>
                
                <p className="complaint-card-status"><span className="complaint-card-status-heading">Status</span>:{complaint.status}</p>
               
                <p className="complaint-card-priority"><span className="complaint-card-priority-heading">Priority</span>:{complaint.priority}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No complaints found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
