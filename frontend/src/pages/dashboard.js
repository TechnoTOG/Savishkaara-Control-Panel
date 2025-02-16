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
    <Layout title="Dashboard">
      {/* Welcome Message */}
      <div style={{ marginTop: "30px", marginLeft: "20px" }}>
        <BlurText
          text={`Welcome back, ${name}!`}
          delay={150}
          animateBy="words"
          direction="top"
          className="welcome-text"
          style={{ color: "#bec0bf" }}
        />
      </div>
      <div style={{ height: "10px" }}></div>

      {/* Display Server Message or Error */}
      {socketError && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Error: {socketError}
        </Typography>
      )}

      {/* Dashboard Content */}
      <div style={{ marginLeft: "20px", width: "90%" }}>
        <Grid container spacing={3}>
          {/* First Column (2 rows) */}
          <Grid item xs={12} md={3.3}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <MetricCard
                  title="Total Customers"
                  height="200px"
                  value={102890}
                  width="220px"

                />

              </Grid>
              <Grid item>
                <MetricCard
                  title="Active Users"
                  height="200px"
                  width="220px"

                  value={2456}

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
                    />
                  </Grid>
                  <Grid item xs={5.1}>
                    <MetricCard
                      title="Conversion Rate"
                      width="200px"
                      height="100px"
                      value={0.156}
                      formatter={(val) => `${(val * 100).toFixed(1)}%`}
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
                    />
                  </Grid>
                  <Grid item xs={5.1}>
                    <VisualizationCard
                      title="User Distribution"
                      chartType="bar"
                      width="240px"
                      height="130px"

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

              height="500px"
            // Set desired height here
            />
          </Grid>

        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;