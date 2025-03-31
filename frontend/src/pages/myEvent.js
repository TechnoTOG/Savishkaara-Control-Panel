import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const MyEvent = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext); // Access global WebSocket instance
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors
  const [event, setEvent] = useState(null); // State to store event details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track fetch errors

  const { eventId } = useParams(); // Extract the event ID from the URL

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    let hasJoinedRoom = false; // Local variable to track room join status

    if (socket && !hasJoinedRoom) {
      // Join the "myevent" room with authentication
      Room.join(socket, "myevent", objID);

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

    // Fetch event details when the component mounts
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/events/${eventId}`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch event details: ${response.statusText}`);
        }

        const eventData = await response.json();
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError(error.message || "An error occurred while fetching event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();

    // Cleanup on unmount
    return () => {
      if (hasJoinedRoom) {
        socket.emit("leave-room", "myevent");
      }
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate, eventId, apiBaseURL]);

  return (
    <Layout title="My Event" activePage="myevent">
      <div style={{ marginTop: "60px", marginLeft: "20px" }}></div>

      {socketError && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Socket Error: {socketError}
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Error: {error}
        </Typography>
      )}

      {loading ? (
        <Typography variant="body1" style={{ marginLeft: "20px" }}>
          Loading...
        </Typography>
      ) : event ? (
        <Card sx={{ width: "80%", margin: "auto", mt: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {event.name}
            </Typography>
            <Typography variant="h6">Venue:</Typography>
            <Typography variant="body1">{event.venue}</Typography>

            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Date and Time:
            </Typography>
            <Typography variant="body1">{new Date(event.date_time).toLocaleString()}</Typography>

            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Fee:
            </Typography>
            <Typography variant="body1">{event.fee}</Typography>

            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Coordinators:
            </Typography>
            <Typography variant="body1">
              {event.coordinator1}, {event.coordinator2}
            </Typography>

            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Faculty Coordinators:
            </Typography>
            <Typography variant="body1">
              {event.faculty_coor1}, {event.faculty_coor2}
            </Typography>

            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Registration Form Link:
            </Typography>
            <a href={event.form_link} target="_blank" rel="noopener noreferrer">
              {event.form_link}
            </a>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#003366",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#00264d",
                },
                width: '100%',
                mt: 4
              }}
              onClick={() => navigate("/eventso")} // Navigate back to the events overview
            >
              Back to Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" style={{ marginLeft: "20px" }}>
          Event not found.
        </Typography>
      )}
    </Layout>
  );
};

export default MyEvent;