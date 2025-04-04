import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Layout from "../layouts/layout";
import EventNoteIcon from "@mui/icons-material/EventNote";

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
  const [ongoingEvents, setOngoingEvents] = useState([]); // State for ongoing events
  const hasJoinedRoom = useRef(false);

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch event count
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

  // Fetch total revenue
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

  // Fetch registration count
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

  // Fetch registration trend data
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

  // Fetch top events data
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
      setTopEvents(data); // Update top events state
    } catch (error) {
      console.error("Error fetching top events data:", error);
    }
  };

  // Fetch ongoing events data
  const fetchOngoingEvents = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/ongoing-events`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch ongoing events data");
      const data = await response.json();
      setOngoingEvents(data); // Update ongoing events state
    } catch (error) {
      console.error("Error fetching ongoing events data:", error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchRegistrationCount(); // Fetch registration count on component mount
    fetchTotalRevenue();
    fetchRegistrationTrend(); // Fetch registration trend data
    fetchTopEvents(); // Fetch top events data
    fetchOngoingEvents(); // Fetch ongoing events data

    const interval = setInterval(() => {
      fetchCount();
      fetchRegistrationCount(); // Fetch counts every 10 seconds
      fetchTotalRevenue();
      fetchRegistrationTrend(); // Fetch registration trend data
      fetchTopEvents(); // Fetch top events data
      fetchOngoingEvents(); // Fetch ongoing events data
    }, 10000);

    if (socket && !hasJoinedRoom.current) {
      socket.emit("join-room", { roomName: "dashboard", objId: objID });
      hasJoinedRoom.current = true;
      socket.on("message", (data) => {
        console.log("Message:", data);
      });
      socket.on("redirect", (data) => {
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
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
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
        grid: {
          display: false, // Hide x-axis grid lines (but keep the axis line)
        },
        ticks: {
          color: "#808080", // Optional: set tick color to match your theme
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Hide y-axis grid lines (but keep the axis line)
        },
        ticks: {
          color: "#808080", // Optional: set tick color to match your theme
        },
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
                  bgColor="#336D82"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Total Participation"
                  height="25vh"
                  value={verifiedRegistrations.toLocaleString()} // Display verified registrations
                  trend="down"
                  bgColor="#205781"
                />
              </Grid>
              {/* 📊 Registration Trend */}
              <Grid item xs={12} md={8}>
                <VisualizationCard
                  title="Registration Trend (by Event)"
                  data={registrationData}
                  options={chartOptions}
                  height="47vh"
                  width="100%"
                />
              </Grid>
              {/* 🏆 Top Events */}
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Top Events"
                  height="41vh" // Let content determine height
                  bgColor={"#1a237e"}
                  sx={{
                    position: "relative",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #ff8a00, #e52e71)",
                    },
                  }}
                >
                  <List
                    dense
                    sx={{
                      padding: "4px 0", // Reduced top/bottom padding
                      "& .MuiListItem-root": {
                        margin: "2px 8px", // Reduced spacing
                        transition: "all 0.2s ease",
                        borderRadius: "6px",
                        "&:hover": {
                          transform: "translateX(4px)",
                          background:
                            "linear-gradient(90deg, rgba(255,138,0,0.2), rgba(229,46,113,0.2))",
                        },
                      },
                    }}
                  >
                    {topEvents.length > 0 ? (
                      topEvents.map((event, index) => (
                        <ListItem
                          key={index}
                          disablePadding
                          sx={{
                            position: "relative",
                            "&:before":
                              index < 5
                                ? {
                                    content: '""',
                                    position: "absolute",
                                    left: "-6px", // Moved closer
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "3px", // Thinner
                                    height: "50%", // Shorter
                                    background: [
                                      "#ffd700", // 1st
                                      "#c0c0c0", // 2nd
                                      "#cd7f32", // 3rd
                                      "#a0a0a0", // 4th
                                      "#808080", // 5th
                                    ][index],
                                    borderRadius: "3px",
                                    opacity: index > 2 ? 0.7 : 1,
                                  }
                                : null,
                          }}
                        >
                          <ListItemText
                            primary={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "7px 12px", // Tighter padding
                                }}
                              >
                                <span
                                  style={{
                                    marginRight: "15px", // Reduced spacing
                                    fontSize: "1.1rem", // Slightly smaller
                                    color: [
                                      "#ffd700",
                                      "#c0c0c0",
                                      "#cd7f32",
                                      "#a0a0a0",
                                      "#808080",
                                    ][index],
                                  }}
                                >
                                  {["🥇", "🥈", "🥉", "🏅", "🎖️"][index]}
                                </span>
                                <span
                                  style={{
                                    fontWeight: 500, // Slightly lighter
                                    fontSize: "0.9rem", // Smaller
                                    color: "#fff",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  {event.event}
                                </span>
                              </div>
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                margin: 0,
                              },
                            }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <EventNoteIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "rgba(255,255,255,0.3)",
                            mb: 1.5,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.9rem",
                          }}
                        >
                          No events data available
                        </Typography>
                      </Box>
                    )}
                  </List>
                </MetricCard>
              </Grid>
            </Grid>
          </Grid>
          {/* 📌 Right Section: Event Update (Increased Height) */}
          <Grid item xs={12} md={3}>
  <MetricCard
    title="Event Update"
    height="75vh"
    bgColor={"#20b2aa"}
  >
    {ongoingEvents.length > 0 ? (
      <List dense>
        {ongoingEvents.map((event, index) => (
          <ListItem
            key={index}
            sx={{
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.1)", // Transparent background
              margin: "4px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border for visibility
              transition: "transform 0.2s ease, background 0.2s ease", // Smooth hover effect
              "&:hover": {
                transform: "scale(1.02)",
                background: "rgba(255, 255, 255, 0.2)", // Slightly darker on hover
              },
            }}
          >
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {event.name}
                  </Typography>
                  {/* LIVE NOW Button */}
                  <Box
                    sx={{
                      backgroundColor: "#fff", // White background
                      color: "#e74c3c", // Red font
                      padding: "2px 8px", // Small padding
                      borderRadius: "4px", // Rounded corners
                      fontSize: "0.75rem", // Smaller font size
                      fontWeight: "bold",
                      textTransform: "uppercase", // Uppercase text
                    }}
                  >
                    LIVE NOW
                  </Box>
                </Box>
              }
              secondary={
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Venue: {event.venue}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", textAlign: "center" }}
        >
          No live events currently.
        </Typography>
      </Box>
    )}
  </MetricCard>
</Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;