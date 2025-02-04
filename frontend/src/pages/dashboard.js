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
          transition: "margin-left 0.3s ease",
          marginLeft: isMinimized ? "80px" : "250px",
          minHeight: "100vh",
          backgroundColor: darkMode ? "#262729" : "#f0f1f6", // Dark mode background
          color: darkMode ? "#ffffff" : "#000000", // Dark mode text color
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
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
        <div style={{ marginLeft: "20px", paddingRight: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard 
                title="Total Customers" 
                value={102890}
                darkMode={darkMode} // Pass dark mode prop
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard 
                title="Total Revenue" 
                value={56562}
                darkMode={darkMode} // Pass dark mode prop
              />
            </Grid>
            {/* Add more cards as necessary */}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;