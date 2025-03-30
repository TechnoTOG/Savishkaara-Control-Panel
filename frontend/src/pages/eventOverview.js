import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material"; // Import Button from Material-UI
import MetricCard from "../components/metricCard"; // Update this component or create a new one
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout"; // Import the Layout component
import { PersonOutline } from "@mui/icons-material";

const EventOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext); // Access global WebSocket instance
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors
  const [events, setEvents] = useState([]); // State to store fetched events

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch events from the backend
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

    // Fetch events from the backend API
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/events`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const data = await response.json();
        if (isMounted) {
          setEvents(data); // Update state with fetched events
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setSocketError(error.message || "An error occurred while fetching events.");
      }
    };

    fetchEvents(); // Call the fetch function

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
  {events.length > 0 ? (
    events.map((event, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <MetricCard
          title={event.name}
          value={`Venue: ${event.venue}`}
          description={`Coordinator: ${event.coordinator1}`}
          textColor="black"
          action={
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#003366",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#00264d",
                },
                width: '100%',
                mt: 2
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${event._id}`);
              }}
            >
              View
            </Button>
          }
        />
      </Grid>
    ))
  ) : (
    <Typography variant="body1" style={{ marginLeft: "20px" }}>
      No events available.
    </Typography>
  )}
</Grid>
      </div>
    </Layout>
  );
};

export default EventOverview;