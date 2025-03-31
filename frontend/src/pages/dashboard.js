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
  const [totalRegistrations, setTotalRegistrations] = useState(0); // Total registrations
  const [verifiedRegistrations, setVerifiedRegistrations] = useState(0); // Total participation (verified)
  const hasJoinedRoom = useRef(false);

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchCount = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/event-count`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
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

  const fetchRegistrationCount = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/events-count`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch registration count");

      const data = await response.json();
      setTotalRegistrations(data.totalRegistrations || 0); // Set total registrations
      setVerifiedRegistrations(data.verifiedRegistrations || 0); // Set verified registrations
    } catch (error) {
      console.error("Error fetching registration count:", error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchRegistrationCount(); // Fetch registration count on component mount

    const interval = setInterval(() => {
      fetchCount();
      fetchRegistrationCount(); // Fetch counts every 10 seconds
    }, 10000);

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
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
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
          {/* 📌 Left Section: Metrics & Registration Trend */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MetricCard title="Total Revenue" height="25vh" value={150000} bgColor="#04b976" />
              </Grid>

              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Total Registration"
                  height="25vh"
                  value={totalRegistrations.toLocaleString()} // Display total registrations
                  trend="up"
                  bgColor="#ff8c00"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Total Participation"
                  height="25vh"
                  value={verifiedRegistrations.toLocaleString()} // Display verified registrations
                  trend="down"
                  bgColor="#c71585"
                />
              </Grid>

              {/* 📊 Registration Trend */}
              <Grid item xs={12} md={8}>
                <VisualizationCard
                  title="Registration Trend"
                  data={registrationData}
                  options={chartOptions}
                  height="43vh"
                  width="100%"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <MetricCard title="Top Events" value={"Squid game (;"} height="38vh" bgColor={"#0000ff"} />
              </Grid>
            </Grid>
          </Grid>

          {/* 📌 Right Section: Event Update (Increased Height) */}
          <Grid item xs={12} md={3}>
            <MetricCard title="Event Update" value={" "} height="72vh" bgColor={"#20b2aa"} />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;