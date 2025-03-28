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
import Cookies from "js-cookie";
import Layout from "../layouts/layout"; // Import the Layout component

const AddEvent = () => {
  const navigate = useNavigate();
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
  const [coordinator1, setCoordinator1] = useState("");
  const [facultyCoordinator1, setFacultyCoordinator1] = useState("");
  const [coordinator2, setCoordinator2] = useState("");
  const [facultyCoordinator2, setFacultyCoordinator2] = useState("");

  const venues = ["Auditorium", "Conference Hall", "Outdoor Stage", "Others"];
  const coordinators = ["Coordinator 1", "Coordinator 2", "Coordinator 3"];

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

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

    try {
      // Send a POST request to /addEvent
      const response = await fetch(`${apiBaseURL}/addEvent`, {
        method: "POST",
        headers: {
          'X-Allowed-Origin': 'testsavi.amritaiedc.site',
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

      // Navigate to the events overview page
      navigate("/events-overview");
    } catch (error) {
      console.error("Error adding event:", error);
      setSocketError(error.message || "An error occurred while adding the event.");
    }
  };

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

            {/* Venue Dropdown */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Venue</InputLabel>
                <Select
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  label="Venue"
                >
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

            {/* Coordinator 1 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Coordinator 1</InputLabel>
                <Select
                  value={coordinator1}
                  onChange={(e) => setCoordinator1(e.target.value)}
                  label="Coordinator 1"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Faculty Coordinator 1 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Faculty Coordinator 1</InputLabel>
                <Select
                  value={facultyCoordinator1}
                  onChange={(e) => setFacultyCoordinator1(e.target.value)}
                  label="Faculty Coordinator 1"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Coordinator 2 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Coordinator 2</InputLabel>
                <Select
                  value={coordinator2}
                  onChange={(e) => setCoordinator2(e.target.value)}
                  label="Coordinator 2"
                >
                  {coordinators.map((coord, index) => (
                    <MenuItem key={index} value={coord}>
                      {coord}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Faculty Coordinator 2 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Faculty Coordinator 2</InputLabel>
                <Select
                  value={facultyCoordinator2}
                  onChange={(e) => setFacultyCoordinator2(e.target.value)}
                  label="Faculty Coordinator 2"
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