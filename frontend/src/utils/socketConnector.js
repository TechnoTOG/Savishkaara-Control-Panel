// utils/socketConnector.js
import io from "socket.io-client";

// Function to initialize and return the WebSocket instance
export const createSocketConnection = () => {
  const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
    reconnection: true, // Enable automatic reconnection
    reconnectionAttempts: 5, // Maximum number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
    timeout: 5000, // Timeout for initial connection attempt (in milliseconds)
  });

  // Event listener for successful connection
  socket.on("connect", () => {
    console.log("WebSocket connected:", socket.id);
  });

  // Event listener for disconnection
  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });

  // Event listener for connection errors
  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error.message);
  });

  // Event listener for failed reconnection attempts
  socket.on("reconnect_failed", () => {
    console.error("WebSocket failed to reconnect after maximum attempts");
  });

  // Event listener for reconnection attempts
  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`WebSocket attempting to reconnect (Attempt ${attemptNumber})...`);
  });

  // Event listener for successful reconnection
  socket.on("reconnect", (attemptNumber) => {
    console.log(`WebSocket successfully reconnected on attempt ${attemptNumber}`);
  });

  return socket;
};