import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Tooltip } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Cookies from "js-cookie";

const Sidebar = ({ isMinimized, darkMode }) => {
  const [openEvents, setOpenEvents] = React.useState(false);
  const [openUsers, setOpenUsers] = React.useState(false);

  const handleEventsClick = () => setOpenEvents(!openEvents);
  const handleUsersClick = () => setOpenUsers(!openUsers);

  const userRole = Cookies.get("role");

  // Define role-based permissions
  const rolePermissions = {
    super: ["Dashboard", "Events", "Samridhi", "Users", "Server"],
    admin: ["Dashboard", "vEvents", "Samridhi"],
    coor: ["Dashboard", "My Event"],
  };

  // Get the allowed options for the current user role
  const allowedOptions = rolePermissions[userRole] || [];

  return (
    <Box
      sx={{
        width: isMinimized ? 80 : 250,
        height: "100vh",
        backgroundColor: darkMode ? "#1b1c1e" : "#111c43",
        color: "#fff",
        paddingTop: "20px",
        transition: "width 0.3s ease",
        position: "fixed",
        overflowX: "hidden",
        borderRight: "1px solid #444",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
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
      <List component="nav">
        {/* Render Dashboard if allowed */}
        {allowedOptions.includes("Dashboard") && (
          <Tooltip title="Dashboard" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/Icons/home_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="dashboard" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Dashboard" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render My Event if allowed */}
        {allowedOptions.includes("vEvents") && (
          <Tooltip title="Events" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/Icons/theater_comedy_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="server" width="24" />
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
                  <img src="/Icons/theater_comedy_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="events" width="24" />
                </ListItemIcon>
                {!isMinimized && <ListItemText primary="Events" />}
                {isMinimized ? null : openEvents ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openEvents && !isMinimized} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 6, color: "#aaa" }}>
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 6, color: "#aaa" }}>
                  <ListItemText primary="Add Event" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Render Samridhi if allowed */}
        {allowedOptions.includes("Samridhi") && (
          <Tooltip title="Samridhi" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/Icons/fastfood_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="samridhi" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Samridhi" />}
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
                  <img src="/Icons/manage_accounts_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="users" width="24" />
                </ListItemIcon>
                {!isMinimized && <ListItemText primary="Users" />}
                {isMinimized ? null : openUsers ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openUsers && !isMinimized} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 6, color: "#aaa" }}>
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 6, color: "#aaa" }}>
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
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/Icons/host_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="server" width="24" />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Server" />}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Render My Event if allowed */}
        {allowedOptions.includes("My Event") && (
          <Tooltip title="My Event" placement="right" disableHoverListener={!isMinimized}>
            <ListItemButton
              sx={{
                color: "#fff",
                justifyContent: isMinimized ? "left" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "#333" : "#222a57",
                },
              }}
            >
              <ListItemIcon sx={{ paddingLeft: isMinimized ? "10px" : "0px" }}>
                <img src="/Icons/theater_comedy_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="server" width="24" />
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