import React, { useState } from "react";
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
import Layout from "../layouts/layout"; // Import your Layout component

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    role: "",
    dept: "",
    event: "",
    mobile: "",
    status: "active",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const apiBaseURL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
  : process.env.REACT_APP_API_URL || "http://localhost:5000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseURL}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include if your backend uses sessions/cookies
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("User added successfully!");
        // Optionally clear the form or redirect
        setFormData({
          name: "",
          username: "",
          gender: "",
          role: "",
          dept: "",
          event: "",
          mobile: "",
          status: "active",
        });
      } else {
        setMessage(`Error: ${data.message}`);
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
          Add User
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
            {/* Department Field */}
            <Grid item xs={12}>
              <TextField
                name="dept"
                label="Department"
                variant="outlined"
                fullWidth
                value={formData.dept}
                onChange={handleChange}
              />
            </Grid>
            {/* Event Field */}
            <Grid item xs={12}>
              <TextField
                name="event"
                label="Event"
                variant="outlined"
                fullWidth
                value={formData.event}
                onChange={handleChange}
              />
            </Grid>
            {/* Mobile Field */}
            <Grid item xs={12}>
              <TextField
                name="mobile"
                label="Mobile"
                variant="outlined"
                fullWidth
                value={formData.mobile}
                onChange={handleChange}
              />
            </Grid>
            {/* Status Field */}
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
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
