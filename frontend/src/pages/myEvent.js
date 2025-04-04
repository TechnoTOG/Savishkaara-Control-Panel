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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Place,
  AccessTime,
  MonetizationOn,
  Group,
  School,
  Link as LinkIcon,
  Event as EventIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
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

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    venue: "",
    date_time: "",
    fee: "",
    coordinators: [""],
    faculty_coordinators: [""],
    form_link: "",
    excel_link: ""
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    let hasJoinedRoom = false;

    if (socket && !hasJoinedRoom) {
      Room.join(socket, "myevent", objID);
      hasJoinedRoom = true;

      socket.on("message", (data) => console.log("Message:", data));
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
          setEvents([data]);
          setSelectedEvent(data);
          setStatus(data.status || "");
          setFormData({
            venue: data.venue,
            date_time: new Date(data.date_time).toISOString().slice(0, 16),
            fee: data.fee,
            coordinators: data.coordinators || [""],
            faculty_coordinators: data.faculty_coordinators || [""],
            form_link: data.form_link,
            excel_link: data.excel_link || ""
          });
          setLoading(false);
          return;
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
        
        if (Array.isArray(fallbackData)) {
          setEvents(fallbackData);
          setSelectedEvent(fallbackData[0]);
          if (fallbackData.length > 0) {
            setStatus(fallbackData[0].status || "");
            setFormData({
              venue: fallbackData[0].venue,
              date_time: new Date(fallbackData[0].date_time).toISOString().slice(0, 16),
              fee: fallbackData[0].fee,
              coordinators: fallbackData[0].coordinators || [""],
              faculty_coordinators: fallbackData[0].faculty_coordinators || [""],
              form_link: fallbackData[0].form_link,
              excel_link: fallbackData[0].excel_link || ""
            });
          }
        } else {
          setEvents([fallbackData]);
          setSelectedEvent(fallbackData);
          setStatus(fallbackData.status || "");
          setFormData({
            venue: fallbackData.venue,
            date_time: new Date(fallbackData.date_time).toISOString().slice(0, 16),
            fee: fallbackData.fee,
            coordinators: fallbackData.coordinators || [""],
            faculty_coordinators: fallbackData.faculty_coordinators || [""],
            form_link: fallbackData.form_link,
            excel_link: fallbackData.excel_link || ""
          });
        }
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
    if (!selectedEvent?.name) return alert("Event name is missing");

    try {
      setIsUpdating(true);
      const response = await fetch(`${apiBaseURL}/events/update-status-by-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Allowed-Origin": "savishkaara.in",
        },
        body: JSON.stringify({ name: selectedEvent.name, status }),
      });

      if (!response.ok) throw new Error("Failed to update event status");

      const updated = await response.json();
      setEvents(events.map(ev => 
        ev._id === selectedEvent._id ? { ...ev, status: updated.status } : ev
      ));
      setSelectedEvent(prev => ({ ...prev, status: updated.status }));
      setConfirmationOpen(true);
    } catch (err) {
      alert(err.message || "Error updating event status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoordinatorChange = (index, value) => {
    const updatedCoordinators = [...formData.coordinators];
    updatedCoordinators[index] = value;
    setFormData({ ...formData, coordinators: updatedCoordinators });
  };

  const handleFacultyCoordinatorChange = (index, value) => {
    const updatedFacultyCoordinators = [...formData.faculty_coordinators];
    updatedFacultyCoordinators[index] = value;
    setFormData({ ...formData, faculty_coordinators: updatedFacultyCoordinators });
  };

  const addCoordinator = () => {
    setFormData({
      ...formData,
      coordinators: [...formData.coordinators, ""]
    });
  };

  const removeCoordinator = (index) => {
    if (formData.coordinators.length <= 1) return;
    const updatedCoordinators = [...formData.coordinators];
    updatedCoordinators.splice(index, 1);
    setFormData({ ...formData, coordinators: updatedCoordinators });
  };

  const addFacultyCoordinator = () => {
    setFormData({
      ...formData,
      faculty_coordinators: [...formData.faculty_coordinators, ""]
    });
  };

  const removeFacultyCoordinator = (index) => {
    if (formData.faculty_coordinators.length <= 1) return;
    const updatedFacultyCoordinators = [...formData.faculty_coordinators];
    updatedFacultyCoordinators.splice(index, 1);
    setFormData({ ...formData, faculty_coordinators: updatedFacultyCoordinators });
  };

  const handleDetailsUpdate = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/events/update-details-by-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Allowed-Origin": "savishkaara.in",
        },
        body: JSON.stringify({ 
          name: selectedEvent.name, 
          venue: formData.venue,
          date_time: formData.date_time,
          fee: formData.fee,
          coordinators: formData.coordinators.filter(c => c.trim() !== ""),
          faculty_coordinators: formData.faculty_coordinators.filter(f => f.trim() !== ""),
          form_link: formData.form_link,
          excel_link: formData.excel_link
        }),
      });

      if (!response.ok) throw new Error("Failed to update event details");

      const updated = await response.json();
      setEvents(events.map(ev => 
        ev._id === selectedEvent._id ? updated.event : ev
      ));
      setSelectedEvent(updated.event);
      setEditMode(false);
      setConfirmationOpen(true);
    } catch (err) {
      alert(err.message || "Error updating event details");
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

  const handleEventChange = (eventId) => {
    const selected = events.find(ev => ev._id === eventId);
    setSelectedEvent(selected);
    setStatus(selected.status || "");
    setFormData({
      venue: selected.venue,
      date_time: new Date(selected.date_time).toISOString().slice(0, 16),
      fee: selected.fee,
      coordinators: selected.coordinators || [""],
      faculty_coordinators: selected.faculty_coordinators || [""],
      form_link: selected.form_link,
      excel_link: selected.excel_link || ""
    });
    setEditMode(false);
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
        ) : events.length > 0 ? (
          <>
            {events.length > 1 && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Event</InputLabel>
                  <Select
                    value={selectedEvent?._id || ''}
                    onChange={(e) => handleEventChange(e.target.value)}
                  >
                    {events.map((ev) => (
                      <MenuItem key={ev._id} value={ev._id}>
                        {ev.name} ({ev.status})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            <Card elevation={4} sx={{ maxWidth: "800px", margin: "auto", p: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" fontWeight="bold">
                    <EventIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    {selectedEvent.name}
                  </Typography>
                  <Box>
                    <Chip label={status.toUpperCase()} color={getStatusColor(status)} />
                    <Button variant="outlined" onClick={() => setEditMode(!editMode)} sx={{ ml: 2 }}>
                      {editMode ? "Cancel Edit" : "Edit Event"}
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {!editMode ? (
                  <Box mb={2}>
                    <Typography variant="subtitle1">
                      <Place sx={{ mr: 1, verticalAlign: "middle" }} /> Venue: {selectedEvent.venue}
                    </Typography>
                    <Typography variant="subtitle1">
                      <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} /> Date & Time: {new Date(selectedEvent.date_time).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1">
                      <MonetizationOn sx={{ mr: 1, verticalAlign: "middle" }} /> Fee: ₹{selectedEvent.fee}
                    </Typography>
                    
                    {selectedEvent.coordinators?.map((coord, index) => (
                      <Typography key={index} variant="subtitle1">
                        <Group sx={{ mr: 1, verticalAlign: "middle" }} /> 
                        Coordinator {index + 1}: {coord}
                      </Typography>
                    ))}
                    
                    {selectedEvent.faculty_coordinators?.map((faculty, index) => (
                      <Typography key={index} variant="subtitle1">
                        <School sx={{ mr: 1, verticalAlign: "middle" }} /> 
                        Faculty Coordinator {index + 1}: {faculty}
                      </Typography>
                    ))}
                    
                    <Typography variant="subtitle1">
                      <LinkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      <a href={selectedEvent.form_link} target="_blank" rel="noopener noreferrer">
                        Registration Link
                      </a>
                    </Typography>
                    {selectedEvent.excel_link && (
                      <Typography variant="subtitle1">
                        <LinkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        <a href={selectedEvent.excel_link} target="_blank" rel="noopener noreferrer">
                          Excel Link
                        </a>
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box mt={3}>
                    <TextField 
                      fullWidth 
                      name="venue" 
                      label="Venue" 
                      value={formData.venue} 
                      onChange={handleFormChange} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      name="date_time" 
                      type="datetime-local" 
                      label="Date & Time" 
                      value={formData.date_time} 
                      onChange={handleFormChange} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      name="fee" 
                      label="Fee" 
                      type="number" 
                      value={formData.fee} 
                      onChange={handleFormChange} 
                      sx={{ mb: 2 }} 
                    />
                    
                    {formData.coordinators.map((coordinator, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={2}>
                        <TextField
                          fullWidth
                          label={`Coordinator ${index + 1}`}
                          value={coordinator}
                          onChange={(e) => handleCoordinatorChange(index, e.target.value)}
                        />
                        {index === formData.coordinators.length - 1 ? (
                          <IconButton onClick={addCoordinator} color="primary" sx={{ ml: 1 }}>
                            <AddIcon />
                          </IconButton>
                        ) : (
                          <IconButton 
                            onClick={() => removeCoordinator(index)} 
                            color="error"
                            sx={{ ml: 1 }}
                            disabled={formData.coordinators.length <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    
                    {formData.faculty_coordinators.map((faculty, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={2}>
                        <TextField
                          fullWidth
                          label={`Faculty Coordinator ${index + 1}`}
                          value={faculty}
                          onChange={(e) => handleFacultyCoordinatorChange(index, e.target.value)}
                        />
                        {index === formData.faculty_coordinators.length - 1 ? (
                          <IconButton onClick={addFacultyCoordinator} color="primary" sx={{ ml: 1 }}>
                            <AddIcon />
                          </IconButton>
                        ) : (
                          <IconButton 
                            onClick={() => removeFacultyCoordinator(index)} 
                            color="error"
                            sx={{ ml: 1 }}
                            disabled={formData.faculty_coordinators.length <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    
                    <TextField 
                      fullWidth 
                      name="form_link" 
                      label="Registration Link" 
                      value={formData.form_link} 
                      onChange={handleFormChange} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      name="excel_link" 
                      label="Excel Link" 
                      value={formData.excel_link} 
                      onChange={handleFormChange} 
                      sx={{ mb: 2 }} 
                    />
                    <Button variant="contained" onClick={handleDetailsUpdate}>
                      Save Changes
                    </Button>
                  </Box>
                )}

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
          </>
        ) : (
          <Typography variant="body1">No events found.</Typography>
        )}
      </Box>

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Update Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>The event details have been successfully updated.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default MyEvent;