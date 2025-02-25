import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Layout from "../layouts/layout"; // Import the Layout component

const Dashboard = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext); // Access global WebSocket instance
  const name = Cookies.get("userName") || "Guest";
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors

  useEffect(() => {
    let hasJoinedRoom = false; // Local variable to track room join status
    if (socket && !hasJoinedRoom) {
      // Join the "dashboard" room with authentication
      socket.emit("join-room", { roomName: "dashboard", objId: objID });
      // Mark the room as joined
      hasJoinedRoom = true;
      // Handle server messages
      socket.on("message", (data) => {
        console.log("Message received:", data);
      });
      // Handle redirection errors
      socket.on("redirect", (data) => {
        console.log("Redirecting to:", data.url);
        navigate(data.url);
      });
      // Handle socket errors
      socket.on("error", (error) => {
        console.error("Socket error:", error.message);
        setSocketError(error.message); // Update the error state
      });
    }
    // Cleanup on unmount
    return () => {
      if (hasJoinedRoom) {
        socket.emit("leave-room", "dashboard");
      }
    };
  }, [socket, objID, navigate]); // Dependencies: socket, objID, navigate

  return (
    <Layout title="Dashboard" activePage="dashboard">
      <div style={{ marginTop: "30px", marginLeft: "20px" }}>
        <BlurText text={`Welcome back, ${name}!`} delay={150} animateBy="words" direction="top" style={{ color: "#bec0bf" }} />
      </div>

      {socketError && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Error: {socketError}
        </Typography>
      )}

      <div style={{ marginLeft: "20px", width: "97%" }}>
        <Grid container spacing={3}>
          {/* First Column */}
          <Grid item xs={12} md={3}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <MetricCard title="Total Registration" height="235px" value={5000} />
              </Grid>
              <Grid item>
                <MetricCard title="Active Users" height="240px" value={2456} />
              </Grid>
            </Grid>
          </Grid>

          {/* Second Column */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              {/* Total Revenue */}
              <Grid item xs={12} sm={6}>
                <MetricCard title="Total Revenue" height="100px" value={150000} />
              </Grid>
              {/* Total Participation */}
              <Grid item xs={12} sm={6}>
                <MetricCard title="Total Participation" height="100px" value={3000} />
              </Grid>
              {/* Revenue and Event Day by Day */}
              <Grid item xs={12} sm={6}>
                <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="130px" />
              </Grid>
              {/* Alerts & Notifications */}
              <Grid item xs={12} sm={6}>
                <VisualizationCard title="Alerts & Notifications" chartType="bar" height="130px" />
              </Grid>
              {/* Top Events */}
              <Grid item xs={12}>
                <VisualizationCard title="Top Events" chartType="pie" height="260px" />
              </Grid>
            </Grid>
          </Grid>

          {/* Third Column */}
          <Grid item xs={12} md={4}>
            <VisualizationCard title="Event Update" chartType="area" height="580px" />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;