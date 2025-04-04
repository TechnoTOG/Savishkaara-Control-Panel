import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import {
  Place,
  AccessTime,
  MonetizationOn,
  Group,
  School,
  Link as LinkIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const MyEvent = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);
  const [error, setError] = useState(null);

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    let hasJoinedRoom = false;

    if (socket && !hasJoinedRoom) {
      Room.join(socket, "myevent", objID);
      hasJoinedRoom = true;

      socket.on("message", (data) => console.log("Message received:", data));
      socket.on("redirect", (data) => navigate(data.url));
      socket.on("error", (error) => setSocketError(error.message));
    }

    const fetchEventDetails = async () => {
      try {
        const idResponse = await fetch(`${apiBaseURL}/events/${eventId}`, {
          method: "GET",
          headers: {
            "X-Allowed-Origin": "savishkaara.in",
            "Content-Type": "application/json",
          },
        });

        if (idResponse.ok) {
          const data = await idResponse.json();
          setEvent(data);
          setStatus(data.status || "");
          setLoading(false);
          return;
        } else {
          console.warn(`Fetch by eventId failed with status: ${idResponse.status}`);
        }

        const userName = Cookies.get("userName");
        if (!userName) throw new Error("User name not found in cookies.");

        const nameResponse = await fetch(
          `${apiBaseURL}/events/by-coordinator/${encodeURIComponent(userName)}`,
          {
            method: "GET",
            headers: {
              "X-Allowed-Origin": "savishkaara.in",
              "Content-Type": "application/json",
            },
          }
        );

        if (!nameResponse.ok) {
          throw new Error(`Fallback fetch failed: ${nameResponse.statusText}`);
        }

        const fallbackData = await nameResponse.json();
        setEvent(fallbackData);
        setStatus(fallbackData.status || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message || "An error occurred while fetching event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();

    return () => {
      if (hasJoinedRoom) socket.emit("leave-room", "myevent");
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate, eventId, apiBaseURL]);

  const handleStatusUpdate = async () => {
    if (!event?.name) return alert("Event name is missing");

    try {
      setIsUpdating(true);
      const response = await fetch(`${apiBaseURL}/events/update-status-by-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Allowed-Origin": "savishkaara.in",
        },
        body: JSON.stringify({ name: event.name, status }),
      });

      if (!response.ok) throw new Error("Failed to update event status");

      const updated = await response.json();
      setEvent(updated);
      alert("Status updated successfully!");
    } catch (err) {
      alert(err.message || "Error updating event status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "info";
      case "ongoing":
        return "success";
      case "completed":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Layout title="My Event" activePage="myevent">
      <Box mt={8} mx={3}>
        {socketError && (
          <Typography variant="body1" color="error" mb={2}>
            Socket Error: {socketError}
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="error" mb={2}>
            Error: {error}
          </Typography>
        )}

        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : event ? (
          <Card elevation={4} sx={{ maxWidth: "800px", margin: "auto", p: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight="bold">
                  <EventIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {event.name}
                </Typography>

                <Chip label={status.toUpperCase()} color={getStatusColor(status)} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  <Place sx={{ mr: 1, verticalAlign: "middle" }} />
                  Venue: {event.venue}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                  Date & Time: {new Date(event.date_time).toLocaleString()}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                  Fee: ₹{event.fee}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <Group sx={{ mr: 1, verticalAlign: "middle" }} />
                  Coordinators: {event.coordinator1}, {event.coordinator2}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: "middle" }} />
                  Faculty: {event.faculty_coor1}, {event.faculty_coor2}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <LinkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  <a href={event.form_link} target="_blank" rel="noopener noreferrer">
                    Registration Link
                  </a>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <LinkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  <a href={event.excel_link} target="_blank" rel="noopener noreferrer">
                    Excel Link
                  </a>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6">Update Event Status:</Typography>

              <Box display="flex" alignItems="center" mt={1}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  sx={{ ml: 2 }}
                >
                  {isUpdating ? "Updating..." : "Save Status"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1">Event not found.</Typography>
        )}
      </Box>
    </Layout>
  );
};

export default MyEvent;
