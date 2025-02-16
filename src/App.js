import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import CreateComplaint from "./components/CreateComplaint";
import AdminDashboard from "./components/AdminDashboard"; // Import Admin Dashboard

// Import the CSS file
import "./App.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || ""); // Get role from localStorage
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Update token and role if they change
    setToken(localStorage.getItem("token") || "");
    setRole(localStorage.getItem("role") || "");
  }, [token]); // Add token as dependency to update when login changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
    navigate("/"); // Redirect to login after logout
  };

  // Check if we are on the login or signup page
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";

  return (
    <div className="app-container">
      <nav className="navbar">
        {/* Conditionally render Login and Signup links based on current route */}
        {!token && !isLoginPage && !isSignupPage && <Link to="/" className="nav-link">Login</Link>}
        {!token && !isLoginPage && !isSignupPage && <Link to="/signup" className="nav-link">Signup</Link>}

        {token && role === "user" && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
        {token && role === "user" && <Link to="/create-complaint" className="nav-link">Create Complaint</Link>}
        {token && role === "admin" && <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>}

        {token && <button onClick={handleLogout} className="logout-btn">Logout</button>}
      </nav>

      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        
        {/* Dashboard for Users */}
        <Route path="/dashboard" element={role === "user" ? <Dashboard token={token} /> : <Login setToken={setToken} />} />
        
        {/* Create Complaint for Users */}
        <Route path="/create-complaint" element={role === "user" ? <CreateComplaint token={token} /> : <Login setToken={setToken} />} />
        
        {/* Admin Dashboard Route */}
        <Route path="/admin-dashboard" element={role === "admin" ? <AdminDashboard token={token} /> : <Login setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
