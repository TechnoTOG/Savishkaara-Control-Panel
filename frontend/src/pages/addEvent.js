import React, { useState, useEffect, useContext } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const AddEvent = () => {
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
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  const venues = ["Auditorium", "Conference Hall", "Outdoor Stage", "Others"];
  const coordinators = ["Coordinator 1", "Coordinator 2", "Coordinator 3"];

  const inputStyles = {
    backgroundColor: theme.palette.mode === "dark" ? "#222" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    "& label, & .MuiInputBase-input": {
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  };

  // Handle form submission
  const handleSubmit = async (e) => {
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

    console.log(eventData);

    try {
      // Send a POST request to /addEvent
      const response = await fetch(`${apiBaseURL}/addEvent`, {
        method: "POST",
        headers: {
          'X-Allowed-Origin': 'savishkaara.in',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to add event: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Event added successfully:", result);

      // Set success message
      setSuccessMessage("Event added successfully!");

      // Reset the form fields after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
        resetFormFields();
      }, 2000);
    } catch (error) {
      console.error("Error adding event:", error);
      setSocketError(error.message || "An error occurred while adding the event.");
    }
  };

  // Function to reset form fields
  const resetFormFields = () => {
    setEventName("");
    setVenue("");
    setOtherVenue("");
    setDateTime("");
    setFee("");
    setLink("");
    setExcelLink("");
    setCoordinator1("");
    setFacultyCoordinator1("");
    setCoordinator2("");
    setFacultyCoordinator2("");
  };

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      Room.join(socket, "eventsa", objID);
      hasJoinedRoom = true;
      socket.on("message", (data) => console.log("Message received:", data));
      socket.on("error", (error) => setSocketError(error.message));
    }
    return () => {
      if (hasJoinedRoom) socket.emit("leave-room", "eventsa");
      socket.off("message");
      socket.off("error");
    };
  }, [socket, objID]);

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
        {/* Success Message */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={2000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            sx={{
              fontSize: "1.2rem", // Increase font size
              padding: "16px", // Add padding for better visibility
              width: "100%",
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
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
                <Select value={coordinator1} onChange={(e) => setCoordinator1(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Faculty Coordinator 1 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Faculty Coordinator 1</InputLabel>
                <Select value={facultyCoordinator1} onChange={(e) => setFacultyCoordinator1(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Coordinator 2 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Coordinator 2</InputLabel>
                <Select value={coordinator2} onChange={(e) => setCoordinator2(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Faculty Coordinator 2 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Faculty Coordinator 2</InputLabel>
                <Select value={facultyCoordinator2} onChange={(e) => setFacultyCoordinator2(e.target.value)} sx={inputStyles}>
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>{coord}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Link" type="text" value={link} onChange={(e) => setLink(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Excel Link" type="text" value={excelLink} onChange={(e) => setExcelLink(e.target.value)} sx={inputStyles} />
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