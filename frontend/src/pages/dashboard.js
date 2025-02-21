import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, useMediaQuery } from "@mui/material";
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

  // Media queries for responsiveness
  const isMobile = useMediaQuery("(max-width:600px)"); // Small screen (xs)
  const isTablet = useMediaQuery("(max-width:900px)"); // Medium screen (sm)

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      socket.emit("join-room", { roomName: "dashboard", objId: objID });
      hasJoinedRoom = true;
      socket.on("message", (data) => console.log("Message received:", data));
      socket.on("redirect", (data) => navigate(data.url));
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

      <div style={{ marginLeft: "20px", width: "90%" }}>
        <Grid container spacing={3} direction={isMobile ? "column" : "row"}>
          {/* First Column */}
          <Grid item xs={12} md={3}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <MetricCard title="Total Registration" height="245px" value={5000} />
              </Grid>
              <Grid item xs={12}>
                <MetricCard title="Active Users" height="245px" value={2456} />
              </Grid>
            </Grid>
          </Grid>

          {/* Second Column */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={3} direction="column">
              {/* First Row (Metric Cards) */}
              <Grid item>
                <Grid container spacing={3} direction={isTablet ? "column" : "row"}>
                  <Grid item xs={12} sm={6}>
                    <MetricCard title="Total Revenue" height="100px" value={150000} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MetricCard title="Total Participation" height="100px" value={3000} />
                  </Grid>
                </Grid>
              </Grid>

              {/* Second Row (Visualization Cards) */}
              <Grid item>
                <Grid container spacing={3} direction={isTablet ? "column" : "row"}>
                  <Grid item xs={12} sm={6}>
                    <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="130px" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <VisualizationCard title="Alerts & Notifications" chartType="bar" height="130px" />
                  </Grid>
                </Grid>
              </Grid>

              {/* Third Row */}
              <Grid item xs={12}>
                <VisualizationCard title="Top Events" chartType="pie" height="270px" />
              </Grid>
            </Grid>
          </Grid>

          {/* Third Column */}
          <Grid item xs={12} md={4}>
            <VisualizationCard title="Event Update" chartType="area" height="583px" />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;
