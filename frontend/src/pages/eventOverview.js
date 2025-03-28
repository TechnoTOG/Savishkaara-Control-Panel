import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material"; // Import arrow icon
import { Link } from "react-router-dom"; // Import Link for navigation
import MetricCard from "../components/metricCard"; // Update this component or create a new one
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout"; // Import the Layout component
import { Box } from '@mui/material';
import { FiberManualRecord } from "@mui/icons-material"; // Import the icon
import { PersonOutline } from "@mui/icons-material"; // Import an icon




const EventOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext); // Access global WebSocket instance
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors

  // Manually added events (for now, since there's no backend)
  const [events, setEvents] = useState([
    {
      name: "Hackathon 2025",
      venue: "Main Hall",
      coordinator: "John Doe",
    },
    {
      name: "Coding Contest",
      venue: "Room 101",
      coordinator: "Jane Smith",
    },
    {
      name: "AI Workshop",
      venue: "Room 202",
      coordinator: "Alice Johnson",
    },
    {
      name: "Tech Conference",
      venue: "Auditorium",
      coordinator: "Bob Brown",
    },
  ]);

  useEffect(() => {
    let isMounted = true; // Track whether component is mounted

    if (socket && isMounted) {
      // Join the "eventso" room with authentication
      Room.join(socket, "eventso", objID);

      // Handle server messages
      socket.on("message", (data) => console.log("Message received:", data));

      // Handle redirection
      socket.on("redirect", (data) => navigate(data.url));

      // Handle errors
      socket.on("error", (error) => setSocketError(error.message));
    }

    return () => {
      isMounted = false;
      socket?.emit("leave-room", "eventso");
      socket?.off("message");
      socket?.off("redirect");
      socket?.off("error");
    };
  }, [socket, objID, navigate]);

  return (
    <Layout title="Events Overview" activePage="eventso">
      <div style={{ marginTop: "60px", marginLeft: "20px" }}></div>

      {socketError && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Error: {socketError}
        </Typography>
      )}

      <div style={{ marginLeft: "20px", marginRight: "20px", width: "auto" }}>
        <Grid container spacing={3}>
          {/* Left Side: Total Registration & Total Participation */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              {/* Total Registration */}
              <Grid item>
                <VisualizationCard
                  title="Total Registration"
                  height="22vh"
                  icon={<PersonOutline />} // Pass the icon
                  
                />
              </Grid>

              {/* Total Participation */}
              <Grid item>
                <VisualizationCard title="Total Participation" chartType="line" height="22vh" />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Side: Revenue Card */}
          <Grid item xs={12} md={4}>
            <VisualizationCard title="Revenue" chartType="line" height="47vh" />

          </Grid>
        </Grid>



        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <BlurText text="Events" delay={150} animateBy="words" direction="top" style={{ color: "#bec0bf" }} />
        </div>

        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard
                title={event.name}
                value={`Venue: ${event.venue}`}
                description={`Coordinator: ${event.coordinator}`}
                additionalInfo={
                  <a href={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
                    View
                  </a>
                }
              />
            </Grid>
          ))}
        </Grid>

      </div>
    </Layout>
  );
};

export default EventOverview;
