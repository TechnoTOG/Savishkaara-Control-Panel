import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import BlurText from "../components/blurText";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";
import { PersonOutline } from "@mui/icons-material";

const EventOverview = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);
  const [events, setEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [verifiedRegistrations, setVerifiedRegistrations] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
      // Update the document title when the component mounts
      document.title = 'Event Overview';
    }, []);

  useEffect(() => {
    let isMounted = true;

    if (socket && isMounted) {
      Room.join(socket, "eventso", objID);
      socket.on("message", (data) => console.log("Message:", data));
      socket.on("error", (error) => setSocketError(error.message));
    }

    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await fetch(`${apiBaseURL}/events`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
        }

        // Fetch registration counts
        const registrationsResponse = await fetch(`${apiBaseURL}/events-count`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!registrationsResponse.ok) {
          throw new Error(`Failed to fetch registration counts: ${registrationsResponse.statusText}`);
        }

        // Fetch revenue data
        const revenueResponse = await fetch(`${apiBaseURL}/events-revenue`, {
          method: "GET",
          headers: {
            'X-Allowed-Origin': 'savishkaara.in',
            "Content-Type": "application/json",
          },
        });

        if (!revenueResponse.ok) {
          throw new Error(`Failed to fetch revenue data: ${revenueResponse.statusText}`);
        }

        const eventsData = await eventsResponse.json();
        const registrationsData = await registrationsResponse.json();
        const revenueData = await revenueResponse.json();

        if (isMounted) {
          setEvents(eventsData);
          setTotalRegistrations(registrationsData.totalRegistrations);
          setVerifiedRegistrations(registrationsData.verifiedRegistrations);
          setRevenueData(revenueData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSocketError(error.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      socket?.emit("leave-room", "eventso");
      socket?.off("message");
      socket?.off("redirect");
      socket?.off("error");
    };
  }, [socket, objID, navigate, apiBaseURL]);

  // Helper function to display coordinators
  const displayCoordinators = (coordinators) => {
    if (!coordinators || coordinators.length === 0) return "No coordinators";
    if (coordinators.length === 1) return `Coordinator: ${coordinators[0]}`;
    return `Coordinators: ${coordinators.join(", ")}`;
  };

  return (
    <Layout title="Events Overview" activePage="eventso">
      <div style={{ marginTop: "60px", marginLeft: "20px" }}></div>

      {socketError && (
        <Typography variant="body1" color="error" style={{ marginLeft: "20px" }}>
          Error: {socketError}
        </Typography>
      )}

      <div style={{ marginLeft: "20px", marginRight: "20px", width: "auto" }}>
        <Grid container spacing={3}>
          {/* Left Side: Total Registration & Total Participation */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              {/* Total Registration */}
              <Grid item>
                {loading ? (
                  <Typography variant="body1">Loading...</Typography>
                ) : socketError ? (
                  <Typography variant="body1" color="error">
                    Error: {socketError}
                  </Typography>
                ) : (
                  <VisualizationCard
                    title="Total Registration"
                    height="23vh"
                    icon={<PersonOutline />}
                    value={totalRegistrations.toLocaleString()}
                  />
                )}
              </Grid>

              {/* Total Participation */}
              <Grid item>
                {loading ? (
                  <Typography variant="body1">Loading...</Typography>
                ) : socketError ? (
                  <Typography variant="body1" color="error">
                    Error: {socketError}
                  </Typography>
                ) : (
                  <VisualizationCard
                    title="Total Participation"
                    height="24vh"
                    value={verifiedRegistrations.toLocaleString()}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Right Side: Revenue Card */}
          <Grid item xs={12} md={6}>
            {loading ? (
              <Typography variant="body1">Loading...</Typography>
            ) : socketError ? (
              <Typography variant="body1" color="error">
                Error: {socketError}
              </Typography>
            ) : revenueData.length > 0 ? (
              <VisualizationCard
                title="Revenue"
                chartType="doughnut"
                data={{
                  labels: revenueData.map((item) => item.name),
                  datasets: [
                    {
                      data: revenueData.map((item) => item.revenue),
                      backgroundColor: [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                      ],
                      hoverBackgroundColor: [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  cutout: "50%",
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 10,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const label = revenueData[tooltipItem.dataIndex].name;
                          const value = revenueData[tooltipItem.dataIndex].revenue;
                          return `${label}: ₹${value}`;
                        },
                      },
                    },
                  },
                }}
                height="50vh"
              />
            ) : (
              <Typography variant="body1">No revenue data available</Typography>
            )}
          </Grid>
        </Grid>

        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <BlurText text="Events" delay={150} animateBy="words" direction="top" style={{ color: "#bec0bf" }} />
        </div>

        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {events.length > 0 ? (
            events.map((event, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MetricCard
                  title={event.name}
                  value={`Venue: ${event.venue}`}
                  description={displayCoordinators(event.coordinators)}
                  textColor="black"
                  action={
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#003366",
                        color: "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "#00264d",
                        },
                        width: '100%',
                        mt: 2
                      }}
                      onClick={() => navigate(`/my-event/${event._id}`)}
                    >
                      View
                    </Button>
                  }
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" style={{ marginLeft: "20px" }}>
              No events available.
            </Typography>
          )}
        </Grid>
      </div>
    </Layout>
  );
};

export default EventOverview;