import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Layout from "../layouts/layout";// Import the Layout component

const Dashboard = () => {
  const navigate = useNavigate();
  const name = Cookies.get("userName") || "Guest";
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: {
        userName: name,
        objId: objID,
      },
    });

    const joinRoom = () => {
      const roomName = "dashboard";
      socket.emit("join-room", roomName);
    };

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      joinRoom();
    });

    socket.on("redirect", (data) => {
      console.log("Redirecting to:", data.url);
      navigate(data.url);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      setSocketError(error.message);
      if (error.message.includes("Unauthorized")) {
        navigate("/403");
      }
    });

    return () => {
      const roomName = "dashboard";
      socket.emit("leave-room", roomName);
      socket.disconnect();
    };
  }, [name, objID, navigate]);

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
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <MetricCard title="Total Customers" value={102890} />
              </Grid>
              <Grid item>
                <MetricCard title="Active Users" value={2456} />
              </Grid>
            </Grid>
          </Grid>

          {/* Second Column (3 rows) */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <MetricCard title="Total Revenue" value={56562} />
                  </Grid>
                  <Grid item xs={6}>
                    <MetricCard
                      title="Conversion Rate"
                      value={0.156}
                      formatter={(val) => `${(val * 100).toFixed(1)}%`}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <VisualizationCard title="Sales Overview" chartType="line" />
                  </Grid>
                  <Grid item xs={6}>
                    <VisualizationCard title="User Distribution" chartType="bar" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <VisualizationCard title="Revenue by Category" chartType="pie" />
              </Grid>
            </Grid>
          </Grid>

          {/* Third Column (1 row) */}
          <Grid item xs={12} md={4}>
            <VisualizationCard title="Monthly Performance" chartType="area" />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;