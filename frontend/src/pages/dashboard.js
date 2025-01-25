import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const Dashboard = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar isMinimized={isMinimized} />
      <div style={{ 
        flex: 1, 
        transition: "margin-left 0.3s ease", 
        marginLeft: isMinimized ? "80px" : "250px", 
        padding: "20px" 
      }}>
        <Header toggleSidebar={toggleSidebar} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Customers</Typography>
                <Typography variant="h4">1,02,890</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">$56,562</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
