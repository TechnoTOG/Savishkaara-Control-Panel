import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import Cookies from "js-cookie";
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

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiBaseURL}/login-auth`, {
        method: "POST",
        headers: {
          'X-Allowed-Origin': 'testsavi.amritaiedc.site',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include", // Include cookies for authenticated requests
      });

      // Parse the response as JSON
      const result = await response.json();

      // Log the raw response and parsed data for debugging
      console.log("Raw response:", response);
      console.log("Parsed data:", result);

      // Handle success or failure based on the response status
      if (response.ok) {
        // Calculate the expiration time (6 hours from now)
        const expirationTime = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);

        // Store user data in cookies with 6-hour expiration
        Cookies.set("objId", result.objectID, { expires: expirationTime });
        Cookies.set("userName", result.name, { expires: expirationTime });
        Cookies.set("gender", result.gender, { expires: expirationTime });
        Cookies.set("dept", result.department, { expires: expirationTime });
        Cookies.set("role", result.role, { expires: expirationTime });

        if (result.redirectToUpdatePassword) {
          navigate("/update-password"); // Redirect to update-password page if condition met
        } else {
          navigate("/"); // Redirect to dashboard after successful login
        }
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
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
            Login
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
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                name="username"
                placeholder="Username"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/icons/person_24dp_EFEFEF_FILL1_wght400_GRAD0_opsz24.svg"
                        alt="username"
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
                value={loginData.username}
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                variant="filled"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/icons/lock_24dp_EFEFEF_FILL1_wght400_GRAD0_opsz24.svg"
                        alt="password"
                        style={{ width: 32, height: 32 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment:
                    (focused || loginData.password) && (
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
                value={loginData.password}
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
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;