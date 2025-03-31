import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
  TextField,
} from "@mui/material";
import MetricCard from "../components/metricCard";
import MetricCardData from "../components/metricCardData";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const UserOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);
  
  // Real data state for user details and flag for super user
  const [userDetails, setUserDetails] = useState([]);
  const [isSuper, setIsSuper] = useState(false);

  // State for inline editing
  const [editingUserName, setEditingUserName] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: "", mobile: "", event_relation: "" });

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch user details for the control table
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/overview/details`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.users);
        // For this example, we assume that if data is returned, the logged-in user is super.
        // You can update this logic if needed.
        setIsSuper(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    const detailsInterval = setInterval(fetchUserDetails, 15000);
    return () => {
      clearInterval(detailsInterval);
    };
  }, [apiBaseURL]);

  // Socket integration using ref to ensure one join
  const hasJoinedRoom = useRef(false);
  useEffect(() => {
    if (socket && !hasJoinedRoom.current) {
      Room.join(socket, "userso", objID);
      hasJoinedRoom.current = true;

      socket.on("message", (data) => {
        console.log("Message received:", data);
      });
      socket.on("redirect", (data) => {
        console.log("Redirecting to:", data.url);
        navigate(data.url);
      });
      socket.on("error", (error) => {
        console.error("Socket error:", error.message);
        setSocketError(error.message);
      });
    }
    return () => {
      if (hasJoinedRoom.current) {
        socket.emit("leave-room", "userso");
        hasJoinedRoom.current = false;
      }
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate]);

  // Inline editing handlers
  const handleEditClick = (user) => {
    setEditingUserName(user.name);
    setEditedUser({
      name: user.name,
      mobile: user.mobile,
      event_relation: user.event_relation,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserName(null);
    setEditedUser({ name: "", mobile: "", event_relation: "" });
  };

  const handleSaveEdit = async (userName) => {
    try {
      const response = await fetch(`${apiBaseURL}/overview/details/${userName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editedUser),
      });
      if (response.ok) {
        setEditingUserName(null);
        setEditedUser({ name: "", mobile: "", event_relation: "" });
        fetchUserDetails();
      } else {
        console.error("Error saving edit");
      }
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleDelete = async (userName) => {
    try {
      const response = await fetch(`${apiBaseURL}/overview/details/${userName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        fetchUserDetails();
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Layout title="Users Overview" activePage="userso">
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
          User Overview
        </Typography>
        {socketError && (
          <Typography variant="body1" color="error">
            Error: {socketError}
          </Typography>
        )}
        <Grid container spacing={3}>
          {/* Metric Cards (if metrics become available) */}
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Total Users"
              value={"0"} // update if metrics available
              height="150px"
              bgColor="#04b976"
              textColor="#fff"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Active Users"
              value={"0"} // update if metrics available
              height="150px"
              bgColor="#ff8c00"
              textColor="#fff"
            />
          </Grid>

          {/* User Details & Control Card */}
          <Grid item xs={12} md={6}>
            <MetricCardData
              title="User Details & Control"
              height="300px"
              bgColor="#20b2aa"
              textColor="#fff"
            >
              <Box sx={{ maxHeight: "260px", overflowY: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Role</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Event</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
                      {isSuper && (
                        <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userDetails.map((user) => (
                      <TableRow key={user.name}>
                        <TableCell sx={{ color: "#fff" }}>
                          {editingUserName === user.name ? (
                            <TextField
                              value={editedUser.name}
                              onChange={(e) =>
                                setEditedUser((prev) => ({ ...prev, name: e.target.value }))
                              }
                              variant="standard"
                              InputProps={{ sx: { color: "#fff" } }}
                            />
                          ) : (
                            user.name
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>{user.role}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          {editingUserName === user.name ? (
                            <TextField
                              value={editedUser.event_relation}
                              onChange={(e) =>
                                setEditedUser((prev) => ({ ...prev, event_relation: e.target.value }))
                              }
                              variant="standard"
                              InputProps={{ sx: { color: "#fff" } }}
                            />
                          ) : (
                            user.event_relation
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          {editingUserName === user.name ? (
                            <TextField
                              value={editedUser.mobile}
                              onChange={(e) =>
                                setEditedUser((prev) => ({ ...prev, mobile: e.target.value }))
                              }
                              variant="standard"
                              InputProps={{ sx: { color: "#fff" } }}
                            />
                          ) : (
                            user.mobile
                          )}
                        </TableCell>
                        {isSuper && (
                          <TableCell>
                            {editingUserName === user.name ? (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ mr: 1, color: "#fff", borderColor: "#fff" }}
                                  onClick={() => handleSaveEdit(user.name)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ mr: 1, color: "#fff", borderColor: "#fff" }}
                                  onClick={() => handleEditClick(user)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(user.name)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </MetricCardData>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default UserOverview;
