  import React, { useState, useEffect, useContext, useRef } from "react";
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
    const [eventCount, setEventCount] = useState(0);
    const hasJoinedRoom = useRef(false);

    const apiBaseURL = process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

    const fetchCount = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/event-count`, {
          method: "GET",
          headers: {
            "X-Allowed-Origin": "testsavi.amritaiedc.site",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch event count");

        const data = await response.json();
        setEventCount(data.totalUsers || 0);
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    useEffect(() => {
      fetchCount();
      const interval = setInterval(fetchCount, 10000); // Fetch count every 10 seconds

      if (socket && !hasJoinedRoom.current) {
        socket.emit("join-room", { roomName: "dashboard", objId: objID });
        hasJoinedRoom.current = true;

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
        clearInterval(interval);
        if (hasJoinedRoom.current) {
          socket.emit("leave-room", "dashboard");
          hasJoinedRoom.current = false;
        }
      };
    }, [socket, objID, navigate]);

    const registrationData = {
      labels: ["January", "February", "March", "April", "May"],
      datasets: [
        {
          label: "Registrations",
          data: [10, 20, 30, 40, 50],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }
      ]
    };
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: { // X-axis scale
          beginAtZero: true,
        },
        y: { // Y-axis scale
          beginAtZero: true,
        },
      },
    };   

    return (
      <Layout title="Dashboard" activePage="dashboard">
  {/* Welcome Message */}
  <div style={{ marginTop: "30px", marginLeft: "20px" }}>
    <BlurText
      text={`Welcome back, ${name}!`}
      delay={150}
      animateBy="words"
      direction="top"
      style={{ color: "#bec0bf" }}
    />
  </div>

  {/* Error Handling */}
  {socketError && (
    <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
      Error: {socketError}
    </Typography>
  )}

  {/* Dashboard Grid */}
  <div style={{ marginLeft: "20px", marginRight: "20px", width: "auto" }}>
    <Grid container spacing={3}>
      
      {/* Left Column - Metrics */}
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Total Revenue"
          height="25vh"
          value={150000}
          bgColor="#04b976"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <MetricCard
          title="Total Registration"
          height="25vh"
          value={eventCount}
          trend="up"
          bgColor="#ff8c00"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <MetricCard
          title="Total Participation"
          height="25vh"
          value={3000}
          bgColor="#c71585"
        />
      </Grid>

      {/* Right Column - Full Height */}
      <Grid item xs={12} md={3} sx={{ gridRow: "span 2" }}>
      <MetricCard title="Event Update" value={" "} height="25vh" bgColor={"#20b2aa"} />
      </Grid>

      {/* Center Column - Charts */}
      <Grid item xs={12} md={6}>
        <VisualizationCard
          title="Registration Trend"
          data={registrationData}
          options={chartOptions}
          height="36vh"
          width="100%"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <MetricCard title="Top Events" value={"Squid game (;"} height="30vh" bgColor={"#0000ff"}/>
      </Grid>

    

    </Grid>
  </div>
</Layout>
    );
  };

  export default Dashboard;
