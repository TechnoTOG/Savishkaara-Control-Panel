import io from "socket.io-client";

export const createSocketConnection = () => {
  // Determine the API URL based on the environment
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_SOCKET_URL || "wss://testapi.amritaiedc.site"
      : process.env.REACT_APP_SOCKET_URL || "ws://localhost:5000";

  const socket = io(apiUrl, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 5000,
    transports: ["polling", "websocket"],
  });

  socket.on("connect", () => {
    console.log("Device connected");
  });

  socket.on("disconnect", () => {
    console.log("Device disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error.message);
  });

  socket.on("reconnect_failed", () => {
    console.error("WebSocket failed to reconnect after maximum attempts");
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`Device attempting to reconnect (Attempt ${attemptNumber})...`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Device successfully reconnected on attempt ${attemptNumber}`);
  });

  return socket;
};