import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout"; // Import the Layout component

const EventOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext); // Access global WebSocket instance
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors

  // Manually added events (for now, since there's no backend)
  const [events, setEvents] = useState([
    { name: "Hackathon 2025", participants: 120 },
    { name: "Coding Contest", participants: 80 },
    { name: "AI Workshop", participants: 60 },
    { name: "Tech Conference", participants: 200 }
  ]);

  useEffect(() => {
    let hasJoinedRoom = false; // Local variable to track room join status

    if (socket && !hasJoinedRoom) {
      // Join the "eventso" room with authentication
      Room.join(socket, "eventso", objID);

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
        socket.emit("leave-room", "eventso");
      }
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
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
          <Grid item xs={12} md={12}> {/* Ensure full width */}
            <Grid container spacing={3} direction="row">
              {/* Visualization Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="22vh" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="22vh" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="22vh" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <VisualizationCard title="Alerts & Notifications" chartType="bar" height="22vh" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <BlurText text="Events" delay={150} animateBy="words" direction="top" style={{ color: "#bec0bf" }} />
        </div>

        {/* Dynamic Event Cards (Manually added for now) */}
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard title={event.name} value={event.participants} description="Participants" />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default EventOverview;
