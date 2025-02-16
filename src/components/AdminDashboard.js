import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";  // Importing the CSS file

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Admin token missing.");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data);
      } catch (err) {
        console.error("❌ Error fetching complaints:", err);
        setError("Failed to fetch complaints. Please try again later.");
      }
    };

    fetchComplaints();
  }, [token]);

  const updateComplaintStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints`,
        { complaintId: id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status } : complaint
        )
      );
    } catch (err) {
      console.error("❌ Error updating complaint status:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>
      {error && <p className="admin-error-message">{error}</p>}

      {/* Card Layout for Complaints */}
      <div className="admin-cards-container">
        {complaints.length > 0 ? (
          complaints.map((complaint, index) => (
            <div key={complaint._id} className="admin-complaint-card">
              <div className="complaint-image">
                {complaint.imagePath ? (
                  <img
                    src={`http://localhost:5000${complaint.imagePath}`}
                    alt="Complaint"
                    className="admin-complaint-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="complaint-details">
                <h3 className="complaint-username">{complaint.userId?.username || "N/A"}</h3>
                <p className="complaint-info"><strong>Mobile:</strong> {complaint.userId?.mobileNumber || "N/A"}</p>
                <p className="complaint-info"><strong>Address:</strong> {complaint.userId?.address || "N/A"}</p>
                <p className="complaint-info"><strong>Issue:</strong> {complaint.issueType}</p>
                <p className="complaint-info"><strong>Description:</strong> {complaint.description}</p>
                <p className="complaint-info"><strong>Status:</strong> {complaint.status}</p>
                <p className="complaint-info"><strong>Priority:</strong> {complaint.priority}</p>
              </div>

              {/* Action Buttons */}
              <div className="admin-actions">
                <button className="btn accept" onClick={() => updateComplaintStatus(complaint._id, "Accepted")}>
                  Accept
                </button>
                <button className="btn reject" onClick={() => updateComplaintStatus(complaint._id, "Rejected")}>
                  Reject
                </button>
                <button className="btn complete" onClick={() => updateComplaintStatus(complaint._id, "Completed")}>
                  Complete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-no-complaints">No complaints found</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
