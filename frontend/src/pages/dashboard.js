import React, { useState, useEffect } from "react";
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
  const name = Cookies.get("userName") || "Guest";
  const [isMinimized, setIsMinimized] = useState(false);

  // Dark mode state (lifted to Dashboard.js)
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      return storedDarkMode === 'true';
    }
  });

  // State to hold messages from the server
  const [serverMessage, setServerMessage] = useState("");

  // Initialize Socket.IO connection
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

    // Send the user's name to the server
    socket.emit("user-connected", { name });

    // Listen for the "message" event from the server
    socket.on("message", (data) => {
      console.log("Received message from server:", data.message);
      setServerMessage(data.message); // Update state with the received message
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [name]);

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
        {/* Dashboard Content (Metric Cards) */}
        <div style={{ marginLeft: "20px", width: "90%" }}>
          {/* Dashboard Content */}
          <Grid container spacing={3}>
  {/* First Column (2 rows) */}
  <Grid item xs={12} md={3.3}>
    <Grid container spacing={3} direction="column">
      {/* First Row in First Column */}
      <Grid item>
        <MetricCard
          title="Total Customers"
          height="200px"
          value={102890}
          width="220px"
          darkMode={darkMode}
        />
      </Grid>
      {/* Second Row in First Column */}
      <Grid item>
        <MetricCard
          title="Active Users"
          height="200px"
          width="220px"

          value={2456}
          darkMode={darkMode}
        />
      </Grid>
    </Grid>
  </Grid>
  {/* Second Column (3 rows) */}
  <Grid item xs={12} md={7}>
    <Grid container spacing={3} direction="column">
      {/* First Row in Second Column (2 columns) */}
      <Grid item>
        <Grid container spacing={3}>
          <Grid item xs={5.1}>
            <MetricCard
              title="Total Revenue"
              width="200px"
              height="100px"
              value={56562}
              darkMode={darkMode}
            />
          </Grid>
          <Grid item xs={5.1}>
            <MetricCard
              title="Conversion Rate"
              width="200px"
              height="100px"
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
          <Grid item xs={5.1}>
            <VisualizationCard
              title="Sales Overview"
              chartType="line"
               width="240px"
              height="130px"
              darkMode={darkMode}
            />
          </Grid>
          <Grid item xs={5.1}>
            <VisualizationCard
              title="User Distribution"
              chartType="bar"
              width="240px"
              height="130px"
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
           width="500px"
              height="180px"
          darkMode={darkMode}
          
        />
      </Grid>
    </Grid>
  </Grid>
  {/* Third Column (1 row) */}
  <Grid item xs={10} md={4}>
    <VisualizationCard
      title="Monthly Performance"
      chartType="area"
      width="250px"
      darkMode={darkMode}
      height="500px" 
       // Set desired height here
    />
  </Grid>
</Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;