import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const UserOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);
  
  // Real data state for metrics and user details
  const [metrics, setMetrics] = useState({ totalUsers: 0, activeUsers: 0 });
  const [loginLog, setLoginLog] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch metrics endpoint (if needed)
  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/api/users/overview/metrics`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics({ totalUsers: data.totalUsers, activeUsers: data.activeUsers });
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  // Fetch login logs (dummy or real)
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/api/users/overview/logs`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setLoginLog(data.logs);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Fetch coordinator details for user control table
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/api/users/overview/details`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.users);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchLogs();
    fetchUserDetails();

    const metricsInterval = setInterval(fetchMetrics, 10000);
    const logsInterval = setInterval(fetchLogs, 10000);
    const detailsInterval = setInterval(fetchUserDetails, 15000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(logsInterval);
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

  return (
    <Layout title="Users Overview" activePage="userso">
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
          User Overview
        </Typography>
        {socketError && (
          <Typography variant="body1" color="error">
            Error: {socketError}
          </Typography>
        )}
        <Grid container spacing={3}>
          {/* Metric Cards */}
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers}
              height="150px"
              bgColor="#04b976"
              textColor="#fff"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers}
              height="150px"
              bgColor="#ff8c00"
              textColor="#fff"
            />
          </Grid>

          {/* Login Log Card */}
          <Grid item xs={12} md={6}>
            <VisualizationCard
              title="Login Log"
              height="300px"
              bgColor="#c71585"
              textColor="#fff"
            >
              <List>
                {loginLog.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <ListItem>
                      <ListItemText
                        primary={entry.user}
                        secondary={entry.time}
                        primaryTypographyProps={{ sx: { color: "#fff" } }}
                        secondaryTypographyProps={{ sx: { color: "#fff" } }}
                      />
                    </ListItem>
                    {index < loginLog.length - 1 && <Divider sx={{ borderColor: "#fff" }} />}
                  </React.Fragment>
                ))}
              </List>
            </VisualizationCard>
          </Grid>

          {/* User Details & Control Card for Coordinators */}
          <Grid item xs={12} md={6}>
            <VisualizationCard
              title="Coordinator Details & Control"
              height="300px"
              bgColor="#20b2aa"
              textColor="#fff"
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Role</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Event</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userDetails.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell sx={{ color: "#fff" }}>{user.name}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{user.role}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{user.event_relation}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{user.mobile}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" sx={{ mr: 1, color: "#fff", borderColor: "#fff" }}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" color="error">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </VisualizationCard>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default UserOverview;
