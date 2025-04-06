import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/metricCard";
import VisualizationCard from "../components/visualizationCard";
import Cookies from "js-cookie";
import { WebSocketContext } from "../App"; // Import WebSocket Context
import Room from "../utils/roomManager"
import Layout from "../layouts/layout";

const Samridhi = () => {
  const navigate = useNavigate();
    const socket = useContext(WebSocketContext); // Access global WebSocket instance
    const objID = Cookies.get("objId");
    const [socketError, setSocketError] = useState(null); // State to track errors

    useEffect(() => {
      // Update the document title when the component mounts
      document.title = 'Samridhi';
    }, []);

    useEffect(() => {
      let hasJoinedRoom = false; // Local variable to track room join status

      if (socket && !hasJoinedRoom) {
        // Join the "add-event" room with authentication
        Room.join(socket, "samridhi", objID);
  
        // Mark the room as joined
        hasJoinedRoom = true;
  
        // Handle server messages
        socket.on("message", (data) => {
          console.log("Message:", data);
        });
  
        // Handle redirection errors
        socket.on("redirect", (data) => {
          navigate(data.url);
        });
  
        // Handle socket errors
        socket.on("error", (error) => {
          console.error("Socket error:", error.message);
          setSocketError(error.message); // Update the error state
        });
      }
  
      // Cleanup on unmount
      return () => {
        if (hasJoinedRoom) {
          socket.emit("leave-room", "samridhi");
        }
        socket.off("message");
        socket.off("redirect");
        socket.off("error");
      };
    }, [socket, objID, navigate]);

  return (
    <Layout title="Samridhi" activePage="samridhi">
      <div>
        <h1>Events</h1>
        <p>This is the main events page.</p>
      </div>
    </Layout>
  );
};

export default Samridhi;