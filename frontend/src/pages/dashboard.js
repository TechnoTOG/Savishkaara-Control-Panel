import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import "../css/dashboard.css";
import Cookies from "js-cookie";
import io from "socket.io-client"; // Import Socket.IO client

const Dashboard = () => {
  const navigate = useNavigate();
  const name = Cookies.get("userName") || "Guest";
  const objID = Cookies.get("objId");
  const [isMinimized, setIsMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      return storedDarkMode === 'true';
    }
  });
  const [socketError, setSocketError] = useState(null); // State to handle Socket.IO errors

  // Initialize Socket.IO connection
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: {
        userName: name, // User's name
        objId: objID, // Example: Additional user data
      },
    });

    const joinRoom = () => {
      const roomName = "dashboard"; // The room you want to join
      socket.emit("join-room", roomName);
    };

    // Listen for the "connect" event
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      joinRoom();
    });

    // Listen for the "redirect" event from the server
    socket.on("redirect", (data) => {
      console.log("Redirecting to:", data.url);
      navigate(data.url); // Redirect to the specified URL
    });

    // Listen for connection errors
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      setSocketError(error.message); // Set error state
      if (error.message.includes("Unauthorized")) {
        navigate("/403"); // Redirect to 403 page for unauthorized access
      }
    });

    // Cleanup on unmount
    return () => {
      const roomName = "dashboard"; // The room to leave
      socket.emit("leave-room", roomName);
      socket.disconnect();
      
    };
  }, [name, objID, navigate]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  // Initialize dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    const systemPreferenceQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemPreferenceChange = (e) => {
      const newDarkMode = e.matches;
      setDarkMode(newDarkMode);
      localStorage.setItem('darkMode', newDarkMode);
      if (newDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    };
    systemPreferenceQuery.addEventListener('change', handleSystemPreferenceChange);
    return () => {
      systemPreferenceQuery.removeEventListener('change', handleSystemPreferenceChange);
    };
  }, [darkMode]);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar with dark mode prop */}
      <Sidebar isMinimized={isMinimized} darkMode={darkMode} />
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          transition: "margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease",
          marginLeft: isMinimized ? "80px" : "250px",
          minHeight: "100vh",
          backgroundColor: "transparent",
          color: darkMode ? "#ffffff" : "#000000",
          willChange: "margin-left, color",
        }}
      >
        {/* Background Wrapper */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: darkMode ? "#262729" : "#f0f1f6",
            transition: "background-color 0.3s ease",
            zIndex: -1,
          }}
        />
        {/* Header with dark mode props */}
        <Header 
          toggleSidebar={toggleSidebar} 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        {/* Welcome Message */}
        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <BlurText
            text={`Welcome back, ${name}!`}
            delay={150}
            animateBy="words"
            direction="top"
            className="welcome-text"
            style={{ color: darkMode ? "#bec0bf" : "#000" }}
          />
        </div>
        <div style={{ height: "10px" }}></div>

        {/* Display Server Message or Error */}
        {socketError && (
          <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
            Error: {socketError}
          </Typography>
        )}

        {/* Dashboard Content (Metric Cards) */}
        <div style={{ marginLeft: "20px", width: "90%" }}>
          {/* Dashboard Content */}
          <Grid container spacing={3}>
            {/* First Column (2 rows) */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3} direction="column">
                {/* First Row in First Column */}
                <Grid item>
                  <MetricCard 
                    title="Total Customers" 
                    value={102890}
                    darkMode={darkMode}
                  />
                </Grid>
                {/* Second Row in First Column */}
                <Grid item>
                  <MetricCard 
                    title="Active Users" 
                    value={2456}
                    darkMode={darkMode}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Second Column (3 rows) */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3} direction="column">
                {/* First Row in Second Column (2 columns) */}
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <MetricCard 
                        title="Total Revenue" 
                        value={56562}
                        darkMode={darkMode}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MetricCard 
                        title="Conversion Rate" 
                        value={0.156}
                        formatter={(val) => `${(val * 100).toFixed(1)}%`}
                        darkMode={darkMode}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Second Row in Second Column (2 columns) */}
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <VisualizationCard
                        title="Sales Overview"
                        chartType="line"
                        darkMode={darkMode}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <VisualizationCard
                        title="User Distribution"
                        chartType="bar"
                        darkMode={darkMode}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Third Row in Second Column (1 column) */}
                <Grid item>
                  <VisualizationCard
                    title="Revenue by Category"
                    chartType="pie"
                    darkMode={darkMode}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Third Column (1 row) */}
            <Grid item xs={12} md={4}>
              <VisualizationCard
                title="Monthly Performance"
                chartType="area"
                darkMode={darkMode}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;