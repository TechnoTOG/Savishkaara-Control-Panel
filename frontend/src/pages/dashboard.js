import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import "../css/dashboard.css";
import Cookies from "js-cookie";

const Dashboard = () => {
  const name = Cookies.get("userName") || "Guest";
  const [isMinimized, setIsMinimized] = useState(false);

  // Dark mode state (lifted to Dashboard.js)
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === null) {
      // If 'darkMode' is not in localStorage, use system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      // If 'darkMode' is in localStorage, use its value
      return storedDarkMode === 'true';
    }
  });
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode); // Save preference to localStorage
    
    // Apply dark mode to the entire app
    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };


  // Initialize dark mode on component mount
  useEffect(() => {
    // Apply dark mode based on state
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    // Listen for system preference changes
    const systemPreferenceQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemPreferenceChange = (e) => {
      const newDarkMode = e.matches;
      setDarkMode(newDarkMode);
      localStorage.setItem('darkMode', newDarkMode); // Sync with localStorage
      if (newDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    };

    systemPreferenceQuery.addEventListener('change', handleSystemPreferenceChange);

    // Cleanup listener on unmount
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
        backgroundColor: "transparent", // Remove background-color from here
        color: darkMode ? "#ffffff" : "#000000", // Dark mode text color
        willChange: "margin-left, color", // Optimize rendering
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
          backgroundColor: darkMode ? "#262729" : "#f0f1f6", // Apply background here
          transition: "background-color 0.3s ease", // Smooth background transition
          zIndex: -1, // Ensure it stays behind content
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
            style={{ color: darkMode ? "#bec0bf" : "#000" }} // Dynamic text color
          />
        </div>
        
        <div style={{ height: "10px" }}></div>

        {/* Dashboard Content (Metric Cards) */}
        <div style={{ marginLeft: "20px", width: "90%"}}>
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