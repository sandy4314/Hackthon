import React, { useState } from "react";
import axios from "axios";
import "./CreateComplaint.css";

const CreateComplaint = ({ token }) => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [image, setImage] = useState(null); // New state for image
  
  const email = localStorage.getItem("email"); // Retrieve email

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      alert("User not authenticated.");
      return;
    }
  
    const formData = new FormData();
    formData.append("issueType", issueType);
    formData.append("description", description);
    formData.append("priority", priority);
  
    if (image) formData.append("image", image); // Append image if selected
    formData.append("email", email); // Send email
  
    try {
      await axios.post("http://localhost:5000/api/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });
  
      alert("Complaint submitted successfully!");
  
      // Clear the input fields after submission
      setIssueType("");
      setDescription("");
      setPriority("low");
      setImage(null); // Clear the selected image
    } catch (err) {
      console.error("Error submitting complaint:", err.response?.data || err.message);
      alert("Failed to submit complaint.");
    }
  };
  
  return (
    <div className="complaint-form-container">
      <h2 className="complaint-form-title">Create a Complaint</h2>
      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="input-container">
          <label htmlFor="issueType">Issue Type</label>
          <input
            type="text"
            id="issueType"
            placeholder="Enter the issue"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter complaint details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="image">Upload Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="submit-btn">Submit Complaint</button>
      </form>
    </div>
  );
};

export default CreateComplaint;
