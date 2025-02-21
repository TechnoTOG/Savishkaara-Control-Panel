import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation after logout
import "../css/header.css";

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode, title }) => {
  const navigate = useNavigate(); // For navigating after logout
  const name = Cookies.get("userName");
  const gender = Cookies.get("gender");
  const department = Cookies.get("dept");
  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // State for managing notifications
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // State for managing profile menu
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  // Simulate fetching notifications from an API
  const fetchNotifications = async () => {
    try {
      // Replace this with your actual API call
      const response = await fetch(`${apiBaseURL}/notifications`)
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Function to mark notifications as read
  const markAsRead = async () => {
    try {
      // Replace this with your actual API call
      await fetch(`${apiBaseURL}/notifications/mark-as-read`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
      setUnreadCount(0); // Reset unread count after marking as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Handle opening the notifications menu
  const handleOpenNotifications = (event) => {
    event.stopPropagation(); // Prevent event propagation
    setAnchorEl(event.currentTarget);
    fetchNotifications(); // Fetch notifications when the menu opens
  };

  // Handle closing the notifications menu
  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  // Handle opening the profile menu
  const handleOpenProfileMenu = (event) => {
    event.stopPropagation(); // Prevent event propagation
    setProfileMenuAnchorEl(event.currentTarget);
  };

  // Handle closing the profile menu
  const handleCloseProfileMenu = () => {
    setProfileMenuAnchorEl(null);
  };

  // Function to handle logout
  const handleLogout = async () => {
    // Clear cookies or session data
    Cookies.remove("userName");
    Cookies.remove("gender");
    Cookies.remove("dept");
    // Call the logout API
    await axios.post(`${apiBaseURL}/logout`, {}, { withCredentials: true }); // Include credentials for session-based auth

    // Redirect to login page or home page
    navigate("/login"); // Replace "/login" with your desired route
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <IconButton onClick={toggleSidebar}>
          <img
            src={
              darkMode
                ? "/icons/menu_24dp_A2A4A6_FILL0_wght400_GRAD0_opsz24.svg"
                : "/icons/menu_24dp_44464B_FILL0_wght400_GRAD0_opsz24.svg"
            }
            alt="Menu"
            className="hamburger-menu"
          />
        </IconButton>
        <span className="navbar-title">{title}</span>
      </div>
      <div className="navbar-profile">
        {/* Dark Mode Icon */}
        <IconButton onClick={toggleDarkMode} sx={{ padding: "2px" }}>
          <img
            src={
              darkMode
                ? "/icons/light_mode_24dp_A2A4A6_FILL0_wght400_GRAD0_opsz24.svg"
                : "/icons/dark_mode_24dp_44464B_FILL0_wght400_GRAD0_opsz24.svg"
            }
            alt={darkMode ? "Dark Mode" : "Light Mode"}
            className="mode-icon"
          />
        </IconButton>

        {/* Notification Icon */}
        <IconButton onClick={handleOpenNotifications} sx={{ padding: "2px" }}>
          <Badge badgeContent={unreadCount} color="error">
            <img
              src={
                darkMode
                  ? "/icons/notifications_24dp_A2A4A6_FILL0_wght400_GRAD0_opsz24.svg"
                  : "/icons/notifications_24dp_44464B_FILL0_wght400_GRAD0_opsz24.svg"
              }
              alt="Notifications"
              className="notification-icon"
            />
          </Badge>
        </IconButton>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNotifications}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              backgroundColor: darkMode ? "#1b1c1e" : "#ffffff",
              color: darkMode ? "#b2b4b4" : "#44464b",
              border: darkMode ? "1px solid #444" : "1px solid #ddd",
            },
          }}
          disableScrollLock
          slotProps={{
            backdrop: {
              style: { pointerEvents: "none" },
            },
          }}
        >
          <div style={{ padding: "10px", width: "300px" }}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Notifications
            </Typography>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={markAsRead}
            >
              Mark All as Read
            </Button>
          </div>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem key={index}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1">{notification.message}</Typography>
                  <Typography
                    variant="caption"
                    style={{
                      color: darkMode ? "#8d8c8c" : "#757474",
                    }}
                  >
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </Typography>
                </div>
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <Typography
                variant="body1"
                style={{
                  color: darkMode ? "#a2a4a6" : "#757474",
                }}
              >
                No new notifications
              </Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Profile Section */}
        <IconButton onClick={handleOpenProfileMenu} sx={{ padding: "2px" }}>
          <img
            src={gender === "female" ? "/profile/female2.png" : "/profile/male_avatar.png"}
            alt="User"
            className="profile-pic"
          />
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenuAnchorEl}
          open={Boolean(profileMenuAnchorEl)}
          onClose={handleCloseProfileMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              backgroundColor: darkMode ? "#1b1c1e" : "#ffffff",
              color: darkMode ? "#b2b4b4" : "#44464b",
              border: darkMode ? "1px solid #444" : "1px solid #ddd",
            },
          }}
          disableScrollLock
          slotProps={{
            backdrop: {
              style: { pointerEvents: "none" },
            },
          }}
        >
          <MenuItem>
            <Typography variant="body1">{name ? name : "Guest"}</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">{department}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Typography variant="body1" style={{ color: "red" }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>

        <div className="profile-info">
          <span className="profile-name">{name ? name : "Guest"}</span>
          <span className="profile-role">{department}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;