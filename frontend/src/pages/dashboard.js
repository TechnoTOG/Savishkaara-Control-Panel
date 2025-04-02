import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, List, ListItem, ListItemText } from "@mui/material"; // Import List components
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
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [registrationTrend, setRegistrationTrend] = useState([]); // State for registration trend data
  const [topEvents, setTopEvents] = useState([]); // New state for top events data
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

  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/events-revenue`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch revenue data");

      const data = await response.json();

      const total = data.reduce((sum, item) => sum + item.revenue, 0); // Sum up all revenue
      setTotalRevenue(total);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
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

  const fetchRegistrationTrend = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/registration-trend`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch registration trend data");

      const data = await response.json();
      setRegistrationTrend(data); // Update registration trend state
    } catch (error) {
      console.error("Error fetching registration trend data:", error);
    }
  };

  // New function to fetch top events
  const fetchTopEvents = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/top-events`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch top events data");

      const data = await response.json();
      console.log("Fetched Top Events:", data); // Debugging: Log the fetched data
      setTopEvents(data); // Update top events state
    } catch (error) {
      console.error("Error fetching top events data:", error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchRegistrationCount(); // Fetch registration count on component mount
    fetchTotalRevenue();
    fetchRegistrationTrend(); // Fetch registration trend data
    fetchTopEvents(); // Fetch top events data

    const interval = setInterval(() => {
      fetchCount();
      fetchRegistrationCount(); // Fetch counts every 10 seconds
      fetchTotalRevenue();
      fetchRegistrationTrend(); // Fetch registration trend data
      fetchTopEvents(); // Fetch top events data
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

  // Prepare data for the Registration Trend chart
  const registrationData = {
    labels: registrationTrend.map((item) => item.event), // Event names
    datasets: [
      {
        label: "Registrations",
        data: registrationTrend.map((item) => item.count), // Counts
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
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
                <MetricCard
                  title="Total Revenue"
                  height="25vh"
                  value={`₹${totalRevenue.toLocaleString()}`}
                  bgColor="#04b976"
                />
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
                  title="Registration Trend (by Event)"
                  data={registrationData}
                  options={chartOptions}
                  height="43vh"
                  width="100%"
                />
              </Grid>

              {/* 🏆 Top Events */}
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Top Events"
                  height="38vh"
                  bgColor={"#0000ff"}
                >
                  {/* Debugging: Log the topEvents data */}
                  {console.log("Rendering Top Events:", topEvents)}
                  {/* Display top events as a list */}
                  <List dense sx={{ maxHeight: "30vh", overflowY: "auto" }}> {/* Ensure scrolling if content overflows */}
                    {topEvents.length > 0 ? (
                      topEvents.map((event, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${index + 1}. ${event.event}`}
                            secondary={`Registrations: ${event.count}`}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body1">No data available</Typography>
                    )}
                  </List>
                </MetricCard>
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