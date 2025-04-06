import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App";
import Room from "../utils/roomManager";
import Layout from "../layouts/layout";

const EventReg = () => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const objID = Cookies.get("objId");
  const [socketError, setSocketError] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [uniqueEvents, setUniqueEvents] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false); // Toggle for all details
  const [searchQuery, setSearchQuery] = useState(""); // Search query for name
  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/event-registrations`, {
        method: "GET",
        headers: {
          "X-Allowed-Origin": "savishkaara.in",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch registrations");
      const data = await response.json();
      setRegistrations(data);
      // Extract unique events
      const events = new Set();
      data.forEach((reg) => {
        const details =
          Array.isArray(reg.ticket_details) && reg.ticket_details.length > 0
            ? reg.ticket_details[0]
            : reg.ticket_details || {};
        if (details.event) events.add(details.event);
      });
      setUniqueEvents(["all", ...Array.from(events).sort()]);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setSocketError(error.message);
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?"))
      return;
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `${apiBaseURL}/delete-event-registrations/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete");
      }
      await fetchRegistrations();
      setSocketError("Registration deleted successfully");
      setTimeout(() => setSocketError(null), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setSocketError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle all details view
  const toggleAllDetails = () => {
    setShowAllDetails(!showAllDetails);
  };

  // Apply filters
  useEffect(() => {
    let filtered = registrations;
    if (selectedEvent !== "all") {
      filtered = filtered.filter((reg) => {
        const details =
          Array.isArray(reg.ticket_details) && reg.ticket_details.length > 0
            ? reg.ticket_details[0]
            : reg.ticket_details || {};
        return details.event === selectedEvent;
      });
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((reg) => {
        const details =
          Array.isArray(reg.ticket_details) && reg.ticket_details.length > 0
            ? reg.ticket_details[0]
            : reg.ticket_details || {};
        return (
          details.name &&
          details.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    setFilteredRegistrations(filtered);
  }, [selectedEvent, registrations, searchQuery]);

  // Initial data load
  useEffect(() => {
    let hasJoinedRoom = false;
    if (socket && !hasJoinedRoom) {
      Room.join(socket, "eventreg", objID);
      hasJoinedRoom = true;
      socket.on("message", (data) => console.log("Message:", data));
      socket.on("redirect", (data) => navigate(data.url));
      socket.on("error", (error) => setSocketError(error.message));
    }
    fetchRegistrations();
    return () => {
      if (hasJoinedRoom) socket.emit("leave-room", "eventreg");
      socket.off("message");
      socket.off("redirect");
      socket.off("error");
    };
  }, [socket, objID, navigate]);

  // Render basic row (collapsed view)
  const renderBasicRow = (registration) => {
    const { _id, ticket_number, ticket_details } = registration;
    const details =
      Array.isArray(ticket_details) && ticket_details.length > 0
        ? ticket_details[0]
        : ticket_details || {};
    return (
      <tr key={_id}>
        <td>{ticket_number}</td>
        <td>{details?.event || "N/A"}</td>
        <td>{details?.name || "N/A"}</td>
        <td>
          <button
            onClick={() => handleDelete(_id)}
            disabled={deleteLoading}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </td>
      </tr>
    );
  };

  // Render expanded row (full details)
  const renderExpandedRow = (registration) => {
    const {
      _id,
      ticket_number,
      timestamp,
      ticket_details,
      verified,
    } = registration;
    const details =
      Array.isArray(ticket_details) && ticket_details.length > 0
        ? ticket_details[0]
        : ticket_details || {};
    return (
      <tr key={_id}>
        <td>{ticket_number}</td>
        <td>{new Date(timestamp).toLocaleString()}</td>
        <td>{details?.name || "N/A"}</td>
        <td>{details?.roll_no || "N/A"}</td>
        <td>{details?.event || "N/A"}</td>
        <td>{details?.year || "N/A"}</td>
        <td>{details?.mobile || "N/A"}</td>
        <td>{details?.amount || "N/A"}</td>
        <td>{verified ? "Yes" : "No"}</td>
        <td>
          <button
            onClick={() => handleDelete(_id)}
            disabled={deleteLoading}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <Layout title="Event Registration" activePage="eventreg">
      <div className="container">
        <h1 style={{ textAlign: "center" }}>Event Registration</h1>
        {loading && <p>Loading registrations...</p>}
        {socketError && (
          <div
            style={{
              padding: "10px",
              margin: "10px 0",
              backgroundColor: socketError.includes("success")
                ? "#d4edda"
                : "#f8d7da",
              color: socketError.includes("success")
                ? "#155724"
                : "#721c24",
              borderRadius: "4px",
            }}
          >
            {socketError}
          </div>
        )}
        {!loading && (
          <>
            {/* Styled Filter Section */}
            <div
              className="filter-section"
              style={{
                marginBottom: "20px",
                padding: "15px",
                
              
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label htmlFor="event-filter" style={{ fontWeight: "bold" }}>
                  Filter by Event:
                </label>
                <select
                  id="event-filter"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    minWidth: "200px",
                    border: "1px solid #ccc",
                  }}
                >
                  {uniqueEvents.map((event) => (
                    <option key={event} value={event}>
                      {event === "all" ? "All Events" : event}
                    </option>
                  ))}
                </select>
                <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  Showing {filteredRegistrations.length} registration(s)
                </span>
              </div>
              <button
                onClick={toggleAllDetails}
                style={{
                  padding: "8px 16px",
                  backgroundColor: showAllDetails ? "#f44336" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {showAllDetails ? "Show Basic View" : "View All Details"}
              </button>
            </div>

            {/* Styled Search Bar */}
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px",
                  width: "300px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Styled Table */}
            <table
              className="registration-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <thead>
                {showAllDetails ? (
                  <tr
                    style={{
                      backgroundColor: "#2196F3", // Changed to blue
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <th>Ticket Number</th>
                    <th>Timestamp</th>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Event</th>
                    <th>Year</th>
                    <th>Mobile</th>
                    <th>Amount</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                ) : (
                  <tr
                    style={{
                      backgroundColor: "#2196F3", // Changed to blue
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <th>Ticket Number</th>
                    <th>Event</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((registration, index) =>
                    showAllDetails
                      ? renderExpandedRow(registration)
                      : renderBasicRow(registration)
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={showAllDetails ? "10" : "4"}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      No registrations found
                      {selectedEvent !== "all" ? ` for ${selectedEvent}` : ""}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <style jsx>{`
       
        .registration-table tr:hover {
          background-color:rgb(107, 100, 100);
        }
        .registration-table td,
        .registration-table th {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        @media (max-width: 768px) {
          .registration-table {
            font-size: 14px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default EventReg;