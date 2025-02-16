import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css"; // Import CSS

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") {
        localStorage.setItem("role", "admin");
        navigate("/admin-dashboard");
      } else {
        localStorage.setItem("role", "user");
        navigate("/dashboard");
      }

      setToken(res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="login-error">{message}</p>}
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Login
        </button>
        <a href="/signup" className="signup-link">
          New User? Sign Up
        </a>
      </form>
    </div>
  );
};

export default Login;
