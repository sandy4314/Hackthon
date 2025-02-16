import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "./Signup.css";

const Signup = ({ setToken }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/signup", formData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create an Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        {message && <p className="error-message">{message}</p>}
        <input
          type="text"
          name="username"
          className="input-field"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="input-field"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="input-field"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobileNumber"
          className="input-field"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          className="input-field"
          placeholder="Address"
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">
          Sign Up
        </button>

        {/* Login Button to redirect to login page */}
        <button type="button" className="login-btn" onClick={handleLoginRedirect}>
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
