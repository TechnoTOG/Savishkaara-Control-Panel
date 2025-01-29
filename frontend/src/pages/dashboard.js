import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard"; // Import the MetricCard component
import VisualizationCard from "../components/visualizationCard"; // Import the VisualizationCard component
import BlurText from "../components/blurText"; // Ensure the correct import path for blurText
import "../css/dashboard.css"

const Dashboard = () => {
  const name = sessionStorage.getItem("userName") || "Guest"; // Fallback if userName is not set
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} />
      
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          transition: "margin-left 0.3s ease",
          marginLeft: isMinimized ? "80px" : "250px", // Adjust margin based on sidebar state
         // Add padding around the entire main content
        }}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Welcome Message */}
        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <BlurText
            text={`Welcome back, ${name}!`}
            delay={150}
            animateBy="words"
            direction="top"
            className="welcome-text"
          />
        </div>
        
        {/* Spacing Between Welcome Message and Cards */}
        <div style={{ height: "10px" }}></div>

        {/* Dashboard Content (Metric Cards) */}
        <div style={{ marginLeft: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Total Customers" value={102890} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Total Revenue" value={56562} />
            </Grid>
            {/* Add more cards as necessary */}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
