import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, List, ListItem, ListItemText, Divider, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const UserOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      Room.join(socket, "userso", objID);
      hasJoinedRoom = true;

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
      if (hasJoinedRoom) {
        socket.emit("leave-room", "userso");
      }
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate]);

  // Dummy data for metrics
  const totalUsers = 1000;
  const activeUsers = 800;

  // Dummy data for login log (last 10 login entries)
  const loginLog = [
    { id: 1, user: "John Doe", time: "2023-08-01 09:00" },
    { id: 2, user: "Jane Smith", time: "2023-08-01 09:30" },
    { id: 3, user: "Alice Johnson", time: "2023-08-01 10:00" },
    { id: 4, user: "Bob Brown", time: "2023-08-01 10:30" },
    { id: 5, user: "Charlie Davis", time: "2023-08-01 11:00" },
    { id: 6, user: "Eva Green", time: "2023-08-01 11:30" },
    { id: 7, user: "Frank Harris", time: "2023-08-01 12:00" },
    { id: 8, user: "Grace Lee", time: "2023-08-01 12:30" },
    { id: 9, user: "Henry Miller", time: "2023-08-01 13:00" },
    { id: 10, user: "Isabella Moore", time: "2023-08-01 13:30" },
  ];

  // Dummy data for user details & control
  const userDetails = [
    { id: 1, name: "John Doe", status: "Active" },
    { id: 2, name: "Jane Smith", status: "Inactive" },
    { id: 3, name: "Alice Johnson", status: "Active" },
    // ... add more users as needed
  ];

  return (
    <Layout title="Users Overview" activePage="userso">
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
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
            <MetricCard title="Total Users" value={totalUsers} height="150px" />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard title="Active Users" value={activeUsers} height="150px" />
          </Grid>

          {/* Login Log Card */}
          <Grid item xs={12} md={6}>
            <VisualizationCard title="Login Log" height="300px">
              <List>
                {loginLog.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <ListItem>
                      <ListItemText primary={entry.user} secondary={entry.time} />
                    </ListItem>
                    {index < loginLog.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </VisualizationCard>
          </Grid>

          {/* User Details & Control Card */}
          <Grid item xs={12} md={6}>
            <VisualizationCard title="User Details & Control" height="300px">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userDetails.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" style={{ marginRight: "5px" }}>
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
