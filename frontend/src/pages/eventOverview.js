import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";
import { PersonOutline } from "@mui/icons-material";

const EventOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);
  const [events, setEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [verifiedRegistrations, setVerifiedRegistrations] = useState(0); // New state for verified count
  const [loading, setLoading] = useState(true);

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;

    if (socket && isMounted) {
      Room.join(socket, "eventso", objID);
      socket.on("message", (data) => console.log("Message received:", data));
      socket.on("error", (error) => setSocketError(error.message));
    }

    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await fetch(`${apiBaseURL}/events`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
        }

        // Fetch registration counts
        const registrationsResponse = await fetch(`${apiBaseURL}/events-count`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!registrationsResponse.ok) {
          throw new Error(`Failed to fetch registration counts: ${registrationsResponse.statusText}`);
        }

        const eventsData = await eventsResponse.json();
        const registrationsData = await registrationsResponse.json();

        if (isMounted) {
          setEvents(eventsData);
          setTotalRegistrations(registrationsData.totalRegistrations); // Total registrations
          setVerifiedRegistrations(registrationsData.verifiedRegistrations); // Verified registrations
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSocketError(error.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      socket?.emit("leave-room", "eventso");
      socket?.off("message");
      socket?.off("redirect");
      socket?.off("error");
    };
  }, [socket, objID, navigate, apiBaseURL]);

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
                {loading ? (
                  <Typography variant="body1">Loading...</Typography>
                ) : socketError ? (
                  <Typography variant="body1" color="error">
                    Error: {socketError}
                  </Typography>
                ) : (
                  <VisualizationCard
                    title="Total Registration"
                    height="22vh"
                    icon={<PersonOutline />}
                    value={totalRegistrations.toLocaleString()} // Format the count with commas
                  />
                )}
              </Grid>

              {/* Total Participation */}
              <Grid item>
                {loading ? (
                  <Typography variant="body1">Loading...</Typography>
                ) : socketError ? (
                  <Typography variant="body1" color="error">
                    Error: {socketError}
                  </Typography>
                ) : (
                  <VisualizationCard
                    title="Total Participation"
                    height="22vh"
                    value={verifiedRegistrations.toLocaleString()} // Display verified count
                  />
                )}
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
              onClick={() => navigate(`/my-event/${event._id}`)} // Pass the event's _id
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