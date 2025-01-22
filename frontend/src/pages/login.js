import React, { useState } from "react";
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

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
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
