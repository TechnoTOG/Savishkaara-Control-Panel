import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Layout from "../layouts/layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const name = Cookies.get("userName") || "Guest";
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);

  // Dummy data for registrations by date
  const registrationData = {
    labels: [
      "Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", 
      "Jan 6", "Jan 7", "Jan 8", "Jan 9", "Jan 10",
      "Jan 11", "Jan 12", "Jan 13", "Jan 14", "Jan 15"
    ],
    datasets: [
      {
        label: "Total Registrations",
        data: [120, 190, 150, 220, 180, 250, 300, 280, 350, 400, 380, 420, 450, 500, 550],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      socket.emit("join-room", { roomName: "dashboard", objId: objID });
      hasJoinedRoom = true;
      socket.on("message", (data) => {
        console.log("Message received:", data);
      });
      socket.on("redirect", (data) => {
        console.log("Redirecting to:", data.url);
        navigate(data.url);
      });
      socket.on("error", (error) => {
        console.error("Socket error:", error.message);
        setSocketError(error.message);
      });
    }
    return () => {
      if (hasJoinedRoom) {
        socket.emit("leave-room", "dashboard");
      }
    };
  }, [socket, objID, navigate]);

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

      <div style={{ marginLeft: "20px", marginRight: "20px", width: "auto" }}>
        <Grid container spacing={3}>
          {/* First Column */}
          <Grid item xs={12} md={3}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <MetricCard 
                  title="Total Registration" 
                  height="35vh" 
                  value={550} // Updated to match the last data point
                  trend="up" // Optional: add trend indicator
                />
              </Grid>
              <Grid item>
                <MetricCard title="Active Users" height="32vh" value={2456} />
              </Grid>
            </Grid>
          </Grid>

          {/* Second Column */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MetricCard title="Total Revenue" height="15vh" value={150000} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard title="Total Participation" height="15vh" value={3000} />
              </Grid>
              {/* Updated Registration Trend Card */}
              <Grid item xs={12}>
                <VisualizationCard 
                  title="Registration Trend" 
                  chartType="line" 
                  height="30vh"
                  data={registrationData}
                  options={chartOptions}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <VisualizationCard title="Alerts & Notifications" chartType="bar" height="20vh" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <VisualizationCard title="Top Events" chartType="pie" height="20vh" />
              </Grid>
            </Grid>
          </Grid>

          {/* Third Column */}
          <Grid item xs={12} md={4}>
            <VisualizationCard title="Event Update" chartType="area" height="81vh" />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;