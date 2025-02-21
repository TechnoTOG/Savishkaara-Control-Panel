import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout"; // Import the Layout component

const Dashboard = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const name = Cookies.get("userName") || "Guest";
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors

  // Refs to access the sidebar and header dimensions
  const sidebarRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      // Join the "dashboard" room with authentication
      Room.join(socket, "dashboard", objID);
      // Mark the room as joined
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
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate]); // Dependencies: socket, objID, navigate

  // Calculate remaining screen space after sidebar and header
  useEffect(() => {
    const calculateRemainingSpace = () => {
      const sidebarHeight = sidebarRef.current?.offsetHeight || 0;
      const sidebarWidth = sidebarRef.current?.offsetWidth || 0;
      const headerHeight = headerRef.current?.offsetHeight || 0;

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const remainingHeight = windowHeight - headerHeight;
      const remainingWidth = windowWidth - sidebarWidth;

      console.log("Remaining Screen Space:");
      console.log(`Height: ${remainingHeight}px`);
      console.log(`Width: ${remainingWidth}px`);
    };

    // Initial calculation
    calculateRemainingSpace();

    // Recalculate on window resize
    window.addEventListener("resize", calculateRemainingSpace);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", calculateRemainingSpace);
    };
  }, []);

  return (
    <Layout
      title="Dashboard"
      activePage="dashboard"
      sidebarRef={sidebarRef} // Pass ref to Layout for sidebar
      headerRef={headerRef} // Pass ref to Layout for header
    >
      {/* Welcome Message */}
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
              <Grid item>
                <MetricCard
                  title="Active Users"
                  height="200px"
                  width="200px"
                  value={2456}
                />
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
                  <Grid item xs={5}>
                    <VisualizationCard
                      title="User Distribution"
                      chartType="bar"
                      width="240px"
                      height="130px"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Third Row */}
              <Grid item xs={12}>
                <VisualizationCard title="Top Events" chartType="pie" height="270px" />
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
