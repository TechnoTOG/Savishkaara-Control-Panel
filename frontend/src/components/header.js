import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#f8f9fa", color: "#333" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome back, User!
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <Avatar alt="User" src="/profile.jpg" />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
