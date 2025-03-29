import React, { useState, useEffect, useContext } from "react"; // Fixed import
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout"; // Import the Layout component

const AddEvent = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext); // Access global WebSocket instance
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null); // State to track errors

  // State for form fields
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [otherVenue, setOtherVenue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [fee, setFee] = useState("");
  const [link, setLink] = useState("");
  const [excelLink, setExcelLink] = useState("");
  const [coordinator, setCoordinator] = useState("");

  const venues = ["Auditorium", "Conference Hall", "Outdoor Stage", "Others"];
  const coordinators = ["Coordinator 1", "Coordinator 2", "Coordinator 3"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName || !venue || !dateTime || !fee || !coordinator) {
      alert("Please fill all required fields.");
      return;
    }
    const eventData = {
      eventName,
      venue: venue === "Others" ? otherVenue : venue,
      dateTime,
      fee,
      link,
      excelLink,
      coordinator,
    };
    if (socket) {
      socket.emit("add-event", { ...eventData, objId: objID });
    }
    navigate("/events-overview");
  };
  useEffect(() => {
    let hasJoinedRoom = false; // Local variable to track room join status

    if (socket && !hasJoinedRoom) {
      // Join the "eventsa" room with authentication
      Room.join(socket, "eventsa", objID);

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
        socket.emit("leave-room", "eventsa");
      }
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate]);

  return (
    <Layout title="Add Event" activePage="eventsa">
      <Box sx={{ marginTop: "60px", marginLeft: "20px", marginRight: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Add New Event
        </Typography>

        {socketError && (
          <Typography variant="body1" color="error" style={{ marginBottom: "20px" }}>
            Error: {socketError}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Event Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Venue</InputLabel>
                <Select value={venue} onChange={(e) => setVenue(e.target.value)} label="Venue">
                  {venues.map((v, index) => (
                    <MenuItem key={index} value={v}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {venue === "Others" && (
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Specify Other Venue" value={otherVenue} onChange={(e) => setOtherVenue(e.target.value)} required />
              </Grid>
            )}

            {/* Date and Time */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date and Time"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Fee */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fee"
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                required
              />
            </Grid>

           

            {/* Coordinators Dropdown */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Coordinator 1</InputLabel>
                <Select
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  label="Coordinator"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Faculty Coordinator 1</InputLabel>
                <Select
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  label="Coordinator"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth >
                <InputLabel>Coordinator 2</InputLabel>
                <Select
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  label="Coordinator"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth >
                <InputLabel> Faculty Coordinator 2</InputLabel>
                <Select
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  label="Coordinator"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
             {/* Link */}
             <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Grid>

            {/* Excel Link */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Excel Link"
                value={excelLink}
                onChange={(e) => setExcelLink(e.target.value)}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "10px 30px", // Increase padding to make the button bigger
                    fontSize: "1.1rem", // Increase font size
                  }}
                >
                  Add Event
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
};

export default AddEvent;