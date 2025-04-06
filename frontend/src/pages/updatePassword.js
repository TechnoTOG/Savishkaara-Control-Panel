import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Cookies from "js-cookie";
const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate(); 

  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
      // Update the document title when the component mounts
      document.title = 'Update Password';
    }, []);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    // Validate that the passwords match and are at least 6 characters long
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
  
    try {
      const response = await fetch(`${apiBaseURL}/update-password`, {
        headers: { 'X-Allowed-Origin': 'savishkaara.in' },
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
        }),
      });
  
      // Check if the response is OK (status code 200-299)
      if (response.ok) {
        const result = await response.json(); // Parse the JSON body
        setSuccess(result.message || "Password updated successfully.");
      
        const role = Cookies.get("role");
        const objId = Cookies.get("objId");
      
        if (role === "coor") {
          navigate(`/my-event/${objId}`);
        } else {
          navigate("/");
        }
      }
       else {
        const errorData = await response.json(); // Parse the JSON body for error details
        setError(errorData.error || "Password update failed. Please try again.");
      }
    } catch (error) {
      console.error("Password Change Error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{
        backgroundImage: `url('/images/bas-van-der-horst-egzVUq4o7bM-unsplash.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          style={{
            padding: "40px",
            borderRadius: "10px",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Update Password
          </Typography>

          {error && (
            <Typography
              variant="body1"
              align="center"
              color="error"
              style={{ marginBottom: "10px" }}
            >
              {error}
            </Typography>
          )}

          {success && (
            <Typography
              variant="body1"
              align="center"
              color="primary"
              style={{ marginBottom: "10px" }}
            >
              {success}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                name="newPassword"
                type="password"
                placeholder="New Password"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/icons/lock_24dp_EFEFEF_FILL1_wght400_GRAD0_opsz24.svg"
                        alt="new password"
                        style={{ width: 32, height: 32 }}
                      />
                    </InputAdornment>
                  ),
                  style: {
                    color: "#fff",
                    paddingBottom: "4px",
                    lineHeight: "1.2",
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
                value={passwordData.newPassword}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "5px",
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                name="confirmNewPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                variant="filled"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/icons/lock_24dp_EFEFEF_FILL1_wght400_GRAD0_opsz24.svg"
                        alt="confirm password"
                        style={{ width: 32, height: 32 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment:
                    (focused || passwordData.confirmNewPassword) && (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          <img
                            src={
                              showPassword
                                ? "/icons/visibility_24dp_EFEFEF_FILL1_wght400_GRAD0_opsz24.svg"
                                : "/icons/visibility_off_24dp_EFEFEF_FILL1_wght400_GRAD0_opsz24.svg"
                            }
                            alt="toggle visibility"
                            style={{ width: 24, height: 24, paddingTop: "14px" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  style: {
                    color: "#fff",
                    paddingBottom: "4px",
                    lineHeight: "1.2",
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
                value={passwordData.confirmNewPassword}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "5px",
                }}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              style={{
                backgroundColor: "#6a0dad",
                color: "#fff",
                fontSize: "18px",
                padding: "10px 0",
              }}
              type="submit"
            >
              Update
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default ChangePassword;
