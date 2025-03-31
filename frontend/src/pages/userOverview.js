import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import MetricCard from "../components/metricCard";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const UserOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");

  const [userDetails, setUserDetails] = useState([]);
  const [metrics, setMetrics] = useState({ totalUsers: 0, activeUsers: 0 });
  
  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch user details and update totalUsers metric
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/overview/details`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.users);
        setMetrics((prev) => ({ ...prev, totalUsers: data.users.length }));
        // Update activeUsers if you have that data, for now it remains 0.
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    const intervalId = setInterval(fetchUserDetails, 15000);
    return () => clearInterval(intervalId);
  }, [apiBaseURL]);

  // Socket integration using a ref to ensure one join
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

  return (
    <Layout title="Users Overview" activePage="userso">
      <Box sx={{ padding: "20px", width: "100%", boxSizing: "border-box" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#171616" }}>
          
        </Typography>
        <Grid container spacing={3}>
          {/* Total Users Metric */}
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers}
              height="150px"
              bgColor="#04b976"
              textColor="#fff"
            />
          </Grid>
          {/* Active Users Metric */}
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers}
              height="150px"
              bgColor="#ff8c00"
              textColor="#fff"
              
              
            />
          </Grid>
          {/* User Details Table */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "rgba(35, 24, 97, 0.45)",
                borderRadius: 2,
                p: 2,
                
                width: "100%",
                boxSizing: "border-box",
                maxHeight: "400px",
                overflowY: "auto",
                
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Event</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mobile</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userDetails.map((user) => (
                    <TableRow key={user.name}>
                    <TableCell sx={{ color: "#fff" }}>{user.name}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{user.role}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{user.event_relation}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{user.mobile}</TableCell>
                    <TableCell>
                      <button
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                        onClick={async () => {
                          const confirmReset = window.confirm(`Are you sure you want to reset status for ${user.name}?`);
                          if (!confirmReset) return;
                        
                          try {
                            const res = await fetch(`${apiBaseURL}/overview/reset-status/${user.mobile}`, {
                              method: "POST",
                              headers: {
                                "X-Allowed-Origin": "savishkaara.in",
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            });
                        
                            const data = await res.json();
                            if (res.ok) {
                              window.alert(data.message || "Status reset successfully");
                            } else {
                              window.alert(data.error || "Something went wrong");
                            }
                          } catch (err) {
                            console.error(err);
                            window.alert("Failed to reset status");
                          }
                        }}
                        
                        
                      >
                        Reset
                      </button>
                    </TableCell>
                  </TableRow>
                  
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default UserOverview;
