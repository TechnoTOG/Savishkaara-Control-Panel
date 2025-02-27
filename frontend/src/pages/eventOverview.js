import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager"
import Layout from "../layouts/layout"; // Import the Layout component

const EventOverview = () => {
  const navigate = useNavigate();
    const socket = useContext(WebSocketContext); // Access global WebSocket instance
    const objID = Cookies.get("objId");
    const [socketError, setSocketError] = useState(null); // State to track errors

    useEffect(() => {
      let hasJoinedRoom = false; // Local variable to track room join status

      if (socket && !hasJoinedRoom) {
        // Join the "add-event" room with authentication
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
       <div style={{ marginTop: "60px", marginLeft: "20px" }}>
      </div>

      {socketError && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Error: {socketError}
        </Typography>
      )}

      <div style={{ marginLeft: "20px", marginRight: "20px", width: "auto" }}>
        <Grid container spacing={3}>
          {/* First Column */}
          

          <Grid item xs={12} md={12}> {/* Ensure the parent container takes full width */}
  <Grid container spacing={3} direction="row"> {/* Set direction to "row" */}
    {/* Total Revenue */}
    <Grid item xs={12} sm={6} md={3}> {/* Each card takes 3 columns on medium screens */}
      <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="22vh" />
    </Grid>
    {/* Total Participation */}
    <Grid item xs={12} sm={6} md={3}> {/* Each card takes 3 columns on medium screens */}
      <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="22vh" />
    </Grid>
    {/* Revenue and Event Day by Day */}
    <Grid item xs={12} sm={6} md={3}> {/* Each card takes 3 columns on medium screens */}
      <VisualizationCard title="Revenue and Event Day by Day" chartType="line" height="22vh" />
    </Grid>
    {/* Alerts & Notifications */}
    <Grid item xs={12} sm={6} md={3}> {/* Each card takes 3 columns on medium screens */}
      <VisualizationCard title="Alerts & Notifications" chartType="bar" height="22vh" />
    </Grid>
  </Grid>
</Grid>

      
        </Grid>
        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
        <BlurText text="Events" delay={150} animateBy="words" direction="top" style={{ color: "#bec0bf" }} />
      </div>
      </div>
    </Layout>
  );
};

export default EventOverview;