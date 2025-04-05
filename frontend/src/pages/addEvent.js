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
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const AddEvent = () => {
  const socket = useContext(WebSocketContext);
  const theme = useTheme();
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [otherVenue, setOtherVenue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [fee, setFee] = useState("");
  const [link, setLink] = useState("");
  const [excelLink, setExcelLink] = useState("");
  
  // Dynamic coordinators state
  const [coordinators, setCoordinators] = useState([{ id: 1, value: "" }]);
  const [facultyCoordinators, setFacultyCoordinators] = useState([{ id: 1, value: "" }]);
  
  const [availableCoordinators, setAvailableCoordinators] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const facultyCoordinatorOptions = [
    "Remya Nair T",
    "Savitha Gopal",
    "Leena V",
    "Soumya Krishnan",
    "Honeymol O",
    "Sreelakshmi S",
    "Anisha G S",
    "Deepa G",
    "Aiswarya Vijayakumar",
    "Resija P R",
    "Dr. Dhanaya R"
  ];

  const venues = ["Auditorium", "Conference Hall", "Outdoor Stage", "Others"];

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  const inputStyles = {
    backgroundColor: theme.palette.mode === "dark" ? "#222" : "#c7c3c3",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    "& label, & .MuiInputBase-input": {
      color: theme.palette.mode === "dark" ? "#c7c3c3" : "#000",
    },
  };

  // Add a new coordinator field
  const addCoordinator = () => {
    setCoordinators([...coordinators, { id: coordinators.length + 1, value: "" }]);
  };

  // Remove a coordinator field
  const removeCoordinator = (id) => {
    if (coordinators.length > 1) {
      setCoordinators(coordinators.filter(coord => coord.id !== id));
    }
  };

  // Update a specific coordinator
  const updateCoordinator = (id, value) => {
    setCoordinators(coordinators.map(coord => 
      coord.id === id ? { ...coord, value } : coord
    ));
  };

  // Add a new faculty coordinator field
  const addFacultyCoordinator = () => {
    setFacultyCoordinators([...facultyCoordinators, { 
      id: facultyCoordinators.length + 1, 
      value: "" 
    }]);
  };

  // Remove a faculty coordinator field
  const removeFacultyCoordinator = (id) => {
    if (facultyCoordinators.length > 1) {
      setFacultyCoordinators(facultyCoordinators.filter(fac => fac.id !== id));
    }
  };

  // Update a specific faculty coordinator
  const updateFacultyCoordinator = (id, value) => {
    setFacultyCoordinators(facultyCoordinators.map(fac => 
      fac.id === id ? { ...fac, value } : fac
    ));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!eventName || !venue || !dateTime || !fee || 
        coordinators[0].value === "" || facultyCoordinators[0].value === "") {
      alert("Please fill all required fields.");
      return;
    }
    
    // Prepare the event data
    const eventData = {
      name: eventName,
      venue: venue === "Others" ? otherVenue : venue,
      dateAndTime: dateTime,
      fee: parseFloat(fee),
      coordinators: coordinators.map(coord => coord.value).filter(Boolean),
      facultyCoordinators: facultyCoordinators.map(fac => fac.value).filter(Boolean),
      registrationLink: link,
      excelLink: excelLink,
    };

    try {
      const response = await fetch(`${apiBaseURL}/addEvent`, {
        method: "POST",
        headers: {
          'X-Allowed-Origin': 'savishkaara.in',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add event: ${response.statusText}`);
      }
      
      const result = await response.json();
      setSuccessMessage("Event added successfully!");
      
      setTimeout(() => {
        setSuccessMessage("");
        resetFormFields();
      }, 2000);
    } catch (error) {
      console.error("Error adding event:", error);
      setSocketError(error.message || "An error occurred while adding the event.");
    }
  };

  // Reset form fields
  const resetFormFields = () => {
    setEventName("");
    setVenue("");
    setOtherVenue("");
    setDateTime("");
    setFee("");
    setLink("");
    setExcelLink("");
    setCoordinators([{ id: 1, value: "" }]);
    setFacultyCoordinators([{ id: 1, value: "" }]);
  };

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/coordinators`);
        const data = await response.json();
        if (response.ok) {
          setAvailableCoordinators(data.coordinators || []);
        } else {
          console.error("Error fetching coordinators:", data.error);
        }
      } catch (error) {
        console.error("Error fetching coordinators:", error);
      }
    };
  
    fetchCoordinators();
  }, [apiBaseURL]);

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      Room.join(socket, "eventsa", objID);
      hasJoinedRoom = true;
      socket.on("message", (data) => console.log("Message:", data));
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
      <Box
        sx={{
          marginTop: "60px",
          marginX: "auto",
          maxWidth: "900px",
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f9f9f9",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: theme.palette.mode === "dark" ? "0 0 20px #000" : "0 0 20px #ccc",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.palette.mode === "dark" ? "#ffd700" : "#333",
            marginBottom: "25px",
          }}
        >
          Add New Event
        </Typography>
  
        {socketError && (
          <Typography variant="body1" color="error" sx={{ marginBottom: "20px" }}>
            Error: {socketError}
          </Typography>
        )}
  
        <Snackbar
          open={!!successMessage}
          autoHideDuration={2000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            sx={{
              fontSize: "1.2rem",
              padding: "16px",
              width: "100%",
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
  
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Event Name & Venue */}
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Event Name" 
                value={eventName} 
                onChange={(e) => setEventName(e.target.value)} 
                required 
                sx={inputStyles} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>Venue</InputLabel>
                <Select value={venue} onChange={(e) => setVenue(e.target.value)} sx={inputStyles}>
                  {venues.map((v, index) => (
                    <MenuItem key={index} value={v}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
  
            {venue === "Others" && (
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Specify Other Venue" 
                  value={otherVenue} 
                  onChange={(e) => setOtherVenue(e.target.value)} 
                  required 
                  sx={inputStyles} 
                />
              </Grid>
            )}
  
            {/* Date, Fee */}
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Date and Time" 
                type="datetime-local" 
                value={dateTime} 
                onChange={(e) => setDateTime(e.target.value)} 
                InputLabelProps={{ shrink: true }} 
                required 
                sx={inputStyles} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Fee (₹)" 
                type="number" 
                value={fee} 
                onChange={(e) => setFee(e.target.value)} 
                required 
                sx={inputStyles} 
              />
            </Grid>
  
            {/* Dynamic Coordinators */}

  
           {/* Dynamic Coordinators */}
{coordinators.map((coord, index) => (
  <Grid item xs={12} key={coord.id}>
    <Box display="flex" alignItems="center" gap={2}>
      <FormControl fullWidth required={index === 0}>
        <InputLabel>{` Student Coordinator ${index + 1}`}</InputLabel>
        <Select 
          value={coord.value} 
          onChange={(e) => updateCoordinator(coord.id, e.target.value)}
          sx={inputStyles}
        >
          {availableCoordinators.map((user, idx) => (
            <MenuItem key={idx} value={user.name}> {/* Send the name */}
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {index === coordinators.length - 1 ? (
        <IconButton onClick={addCoordinator} color="primary">
          <AddIcon />
        </IconButton>
      ) : (
        <IconButton 
          onClick={() => removeCoordinator(coord.id)} 
          color="error"
          disabled={coordinators.length <= 1}
        >
          <RemoveIcon />
        </IconButton>
      )}
    </Box>
  </Grid>
))}

{/* Dynamic Faculty Coordinators */}
{facultyCoordinators.map((facCoord, index) => (
  <Grid item xs={12} key={facCoord.id}>
    <Box display="flex" alignItems="center" gap={2}>
      <FormControl fullWidth required={index === 0}>
        <InputLabel>{`Faculty Coordinator ${index + 1}`}</InputLabel>
        <Select 
          value={facCoord.value} 
          onChange={(e) => updateFacultyCoordinator(facCoord.id, e.target.value)}
          sx={inputStyles}
        >
          {availableCoordinators.map((user, idx) => (
            <MenuItem key={idx} value={user.name}> {/* Send the name */}
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {index === facultyCoordinators.length - 1 ? (
        <IconButton onClick={addFacultyCoordinator} color="primary">
          <AddIcon />
        </IconButton>
      ) : (
        <IconButton 
          onClick={() => removeFacultyCoordinator(facCoord.id)} 
          color="error"
          disabled={facultyCoordinators.length <= 1}
        >
          <RemoveIcon />
        </IconButton>
      )}
    </Box>
  </Grid>
))}
  
  
            {/* Links */}
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Registration Link" 
                type="text" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
                sx={inputStyles} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Excel Link" 
                type="text" 
                value={excelLink} 
                onChange={(e) => setExcelLink(e.target.value)} 
                sx={inputStyles} 
              />
            </Grid>
  
            {/* Submit */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "12px 40px",
                    fontSize: "1.2rem",
                    borderRadius: "30px",
                    textTransform: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                      transform: "scale(1.03)",
                    },
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