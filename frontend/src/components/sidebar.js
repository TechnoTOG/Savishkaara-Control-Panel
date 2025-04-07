import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Tooltip } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";

const Sidebar = ({ isMinimized, darkMode, activePage }) => {
  const [openEvents, setOpenEvents] = React.useState(false);
  const [openUsers, setOpenUsers] = React.useState(false);
  const [leaveCount, setLeaveCount] = React.useState(0); // Persist leaveCount across renders
  const navigate = useNavigate(); // Initialize useNavigate
  const socket = React.useContext(WebSocketContext); // Access WebSocket instance

  const handleEventsClick = () => setOpenEvents(!openEvents);
  const handleUsersClick = () => setOpenUsers(!openUsers);

  const userRole = Cookies.get("role");

  // Define role-based permissions
  const rolePermissions = {
    super: ["Dashboard", "Events", "Samridhi", "Users", "Server", "Registration Data", "Mailer"], // Added "Event Registration"
    admin: ["Dashboard", "vEvents", "Samridhi"],
    coor: ["My Event"],
  };

  // Get the allowed options for the current user role
  const allowedOptions = rolePermissions[userRole] || [];

  // Navigation handlers with room leave logic
  const navigateTo = (path, newRoom) => {
    if (socket && leaveCount < 1 && activePage !== newRoom) {
      // Emit leave-room event for the current room
      Room.leave(socket, activePage);
      setLeaveCount((prevCount) => prevCount + 1); // Increment leaveCount
    }
    // Navigate to the specified route
    navigate(path);
  };

  return (
    <Box
      className="sidebar"
      sx={{
        width: isMinimized ? 80 : 250,
        height: "100vh",
        backgroundColor: darkMode ? "#1b1c1e" : "#111c43",
        color: "#fff",
        paddingTop: "20px",
        overflowX: "hidden",
        borderRight: "1px solid #444",
        transition: "width 0.6s ease",
      }}
    >
      {/* Logo Section */}
      <Box
        textAlign="center"
        mb={4}
        display="flex"
        alignItems="center"
        justifyContent={isMinimized ? "center" : "space-around"}
        paddingX={isMinimized ? 0 : 2}
      >
        <img src="/icons/saavishkaara_logo_new.png" alt="logo" width={isMinimized ? "40" : "80"} />
        {!isMinimized && <span style={{ fontSize: "1.2rem", fontWeight: "bold", paddingRight: "5px" }}>Savishkaara</span>}
      </Box>

      {/* Sidebar Navigation */}
      <List component="nav">
        {/* Render Dashboard if allowed */}
        {allowedOptions.includes("Dashboard") && (
          <Tooltip title="Dashboard" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              onClick={() => navigateTo("/", "dashboard")}
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/icons/home_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="dashboard" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Dashboard" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render My Event if allowed */}
        {allowedOptions.includes("vEvents") && (
          <Tooltip title="Events" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              onClick={() => navigateTo("/events", "vevents")} // Navigate to the events page
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/icons/theater_comedy_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="server" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Events" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render Events if allowed */}
        {allowedOptions.includes("Events") && (
          <>
            <Tooltip title="Events" placement="right" disableHoverListener={!isMinimized}>
              <ListItemButton
                onClick={handleEventsClick}
                sx={{
                  color: "#fff",
                  justifyContent: isMinimized ? "left" : "flex-start",
                  "&:hover": {
                    backgroundColor: darkMode ? "#333" : "#222a57",
                  },
                }}
              >
                <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                  <img src="/icons/theater_comedy_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="events" width="24" />
                </ListItemIcon>
                {!isMinimized && <ListItemText primary="Events" />}
                {isMinimized ? null : openEvents ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openEvents && !isMinimized} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => navigateTo("/events/overview", "eventso")} // Navigate to events overview
                  sx={{ pl: 6, color: "#aaa" }}
                >
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton
                  onClick={() => navigateTo("/events/add", "eventsa")} // Navigate to add event
                  sx={{ pl: 6, color: "#aaa" }}
                >
                  <ListItemText primary="Add Event" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}
        
        {/* Render Event Registration if allowed */}
        {allowedOptions.includes("Registration Data") && (
          <Tooltip title="Registration Data" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              onClick={() => navigateTo("/event-registration", "eventreg")} // Navigate to event registration
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/icons/hard_drive_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="Registration Data" width="24" /> {/* Add an icon */}
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Registration Data" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render Mailer if allowed */}
        {allowedOptions.includes("Registration Data") && (
          <Tooltip title="Mailer" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              onClick={() => navigateTo("/Mailer", "mailer")} // Navigate to event registration
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/icons/outgoing_mail_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="Mailer" width="24" /> {/* Add an icon */}
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Mailer" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render Users if allowed */}
        {allowedOptions.includes("Users") && (
          <>
            <Tooltip title="Users" placement="right" disableHoverListener={!isMinimized}>
              <ListItemButton
                onClick={handleUsersClick}
                sx={{
                  color: "#fff",
                  justifyContent: isMinimized ? "left" : "flex-start",
                  "&:hover": {
                    backgroundColor: darkMode ? "#333" : "#222a57",
                  },
                }}
              >
                <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                  <img src="/icons/manage_accounts_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="users" width="24" />
                </ListItemIcon>
                {!isMinimized && <ListItemText primary="Users" />}
                {isMinimized ? null : openUsers ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openUsers && !isMinimized} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => navigateTo("/users/overview", "userso")} // Navigate to users overview
                  sx={{ pl: 6, color: "#aaa" }}
                >
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton
                  onClick={() => navigateTo("/users/add", "usersa")} // Navigate to add user
                  sx={{ pl: 6, color: "#aaa" }}
                >
                  <ListItemText primary="Add User" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Render Server if allowed */}
        {allowedOptions.includes("Server") && (
          <Tooltip title="Server" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              onClick={() => navigateTo("/server", "server")} // Navigate to server
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/icons/host_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="server" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Server" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render My Event if allowed */}
        {allowedOptions.includes("My Event") && (
          <Tooltip title="My Event" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              onClick={() => {
                const objId = Cookies.get("objId");
                navigateTo(`/my-event/${objId}`, "myevent");
              }}
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/icons/theater_comedy_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="server" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="My Event" />}
            </ListItemButton>
          </Tooltip>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;