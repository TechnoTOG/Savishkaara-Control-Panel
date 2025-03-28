import React, { useState, useEffect, useContext } from "react";
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
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const AddEvent = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const theme = useTheme(); // Get theme for light/dark mode
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);

  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [otherVenue, setOtherVenue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [fee, setFee] = useState("");
  const [link, setLink] = useState("");
  const [excelLink, setExcelLink] = useState("");
  const [coordinator1, setCoordinator1] = useState("");
  const [facultyCoordinator1, setFacultyCoordinator1] = useState("");
  const [coordinator2, setCoordinator2] = useState("");
  const [facultyCoordinator2, setFacultyCoordinator2] = useState("");

  const venues = ["Auditorium", "Conference Hall", "Outdoor Stage", "Others"];
  const coordinators = ["Coordinator 1", "Coordinator 2", "Coordinator 3"];

  const inputStyles = {
    backgroundColor: theme.palette.mode === "dark" ? "#222" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    "& label, & .MuiInputBase-input": {
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!eventName || !venue || !dateTime || !fee || !coordinator1 || !facultyCoordinator1) {
      alert("Please fill all required fields.");
      return;
    }

    // Prepare the event data
    const eventData = {
      name: eventName,
      venue: venue === "Others" ? otherVenue : venue,
      dateAndTime: dateTime,
      fee: parseFloat(fee), // Convert fee to a number
      coor1: coordinator1,
      coor2: coordinator2,
      facoor1: facultyCoordinator1,
      facoor2: facultyCoordinator2,
      flinik: link,
      elink: excelLink,
    };
    if (socket) {
      socket.emit("add-event", { ...eventData, objId: objID });
    }
    navigate("/events-overview");
  };

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      Room.join(socket, "eventsa", objID);
      hasJoinedRoom = true;
      socket.on("message", (data) => console.log("Message received:", data));
      socket.on("redirect", (data) => navigate(data.url));
      socket.on("error", (error) => setSocketError(error.message));
    }
    return () => {
      if (hasJoinedRoom) socket.emit("leave-room", "eventsa");
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
          <Typography variant="body1" color="error" sx={{ marginBottom: "20px" }}>
            Error: {socketError}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required sx={inputStyles} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Venue</InputLabel>
                <Select value={venue} onChange={(e) => setVenue(e.target.value)} sx={inputStyles}>
                  {venues.map((v, index) => (
                    <MenuItem key={index} value={v}>
                      {v}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Other Venue Field */}
            {venue === "Others" && (
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Specify Other Venue" value={otherVenue} onChange={(e) => setOtherVenue(e.target.value)} required sx={inputStyles} />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Date and Time" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} InputLabelProps={{ shrink: true }} required sx={inputStyles} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Fee" type="number" value={fee} onChange={(e) => setFee(e.target.value)} required sx={inputStyles} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Coordinator 1</InputLabel>
                <Select value={coordinator} onChange={(e) => setCoordinator(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Faculty Coordinator 1 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}> Faculty Coordinator 1</InputLabel>
                <Select value={coordinator} onChange={(e) => setCoordinator(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Coordinator 2 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Coordinator 2</InputLabel>
                <Select value={coordinator} onChange={(e) => setCoordinator(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Faculty Coordinator 2 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}> Faculty Coordinator 2</InputLabel>
                <Select value={coordinator} onChange={(e) => setCoordinator(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Link" type="text" value={fee} onChange={(e) => setFee(e.target.value)} required sx={inputStyles} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Excel Link" type="text" value={fee} onChange={(e) => setFee(e.target.value)} required sx={inputStyles} />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary" sx={{ padding: "10px 30px", fontSize: "1.1rem" }}>
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
