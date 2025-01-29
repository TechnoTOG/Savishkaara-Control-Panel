import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { Grid } from "@mui/material";
import MetricCard from "../components/metricCard"; // Import the MetricCard component
import VisualizationCard from "../components/visualizationCard"; // Import the VisualizationCard component

const Dashboard = () => {
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
        
        {/* Dashboard Content */}
        <div style={{ marginTop: "40px", marginLeft: "20px" }}> {/* Add some space between the header and cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Total Customers" value="1,02,890" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Total Revenue" value="$56,562" />
            </Grid>
            {/* Add more cards as necessary */}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;