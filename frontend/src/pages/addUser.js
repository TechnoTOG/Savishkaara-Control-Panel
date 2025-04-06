import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Layout from "../layouts/layout";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    role: "",
    dept: "",
    event_relation: "",
    mobile: ""
  });
  const [message, setMessage] = useState("");
  const [eventOptions, setEventOptions] = useState([]);

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  useEffect(() => {
    // Update the document title when the component mounts
    document.title = 'Add User';
  }, []);

  // When the role is coordinator ("coor"), fetch available distinct events
  useEffect(() => {
    const lowerRole = formData.role.trim().toLowerCase();
    if (lowerRole === "coor" || lowerRole === "coordinator") {
      fetch(`${apiBaseURL}/distinctEvents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Allowed-Origin": "savishkaara.in",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.events) {
            setEventOptions(data.events);
          }
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    }
  }, [formData.role, apiBaseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseURL}/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Allowed-Origin": "savishkaara.in",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("User added successfully!");
        setFormData({
          name: "",
          username: "",
          gender: "",
          role: "",
          dept: "",
          event_relation: "",
          mobile: ""
        });
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("An error occurred while adding the user.");
    }
  };

  return (
    <Layout title="Add User" activePage="usersa">
      <Paper style={{ margin: "20px auto", padding: "20px", maxWidth: "600px" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New User
        </Typography>
        {message && (
          <Typography variant="body1" style={{ marginBottom: "10px" }}>
            {message}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Username Field */}
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Gender Field */}
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Role Field */}
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="super">Super</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="coor">Coordinator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Conditional Field: Department or Event */}
            {formData.role.trim().toLowerCase() === "coor" ||
            formData.role.trim().toLowerCase() === "coordinator" ? (
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth required>
                  <InputLabel id="event-label">Event</InputLabel>
                  <Select
                    labelId="event-label"
                    name="event_relation"
                    value={formData.event_relation}
                    onChange={handleChange}
                    label="Event"
                  >
                    {eventOptions.map((ev, idx) => (
                      <MenuItem key={idx} value={ev}>
                        {ev}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  name="dept"
                  label="Department"
                  variant="outlined"
                  fullWidth
                  value={formData.dept}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
            {/* Mobile Field */}
            <Grid item xs={12}>
              <TextField
                name="mobile"
                label="Mobile"
                variant="outlined"
                fullWidth
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add User
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  );
};

export default AddUser;
