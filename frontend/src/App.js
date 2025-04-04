// App.js
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { createSocketConnection } from "./utils/socketConnector"; // Import the WebSocket connection logic

// Import Pages
import Login from "./pages/login";
import UpdatePassword from "./pages/updatePassword";
import Dashboard from "./pages/dashboard";
import EventOverview from "./pages/eventOverview";
import AddEvent from "./pages/addEvent";
import Events from "./pages/eventOverview";
import MyEvent from "./pages/myEvent";
import Samridhi from "./pages/samridhi";
import UserOverview from "./pages/userOverview";
import AddUser from "./pages/addUser";
import Server from "./pages/server";
import ForbiddenPage from "./pages/forbidden"; // Import the 403 page component



// Function to check authentication status
const checkAuth = async () => {
  const apiBaseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";
    
  try {
    const response = await fetch(`${apiBaseURL}/check-auth`, {
      headers: {'X-Allowed-Origin': 'testsavi.amritaiedc.site'},
      credentials: "include", // Important to send cookies
    });

    if (!response.ok) {
      throw new Error("Failed to fetch authentication status");
    }

    const data = await response.json();
    console.log("Auth check response:", data); // Log for debugging
    return data.isAuthenticated;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

// ProtectedRoute component to guard authenticated routes
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuth().then(setIsAuthenticated);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading while checking auth
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Create a WebSocket Context
export const WebSocketContext = createContext();

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection using the utility function
    const newSocket = createSocketConnection();
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      <Router>
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/update-password" element={<ProtectedRoute element={<UpdatePassword />} />} />
          <Route path="/events/overview" element={<ProtectedRoute element={<EventOverview />} />} />
          <Route path="/events/add" element={<ProtectedRoute element={<AddEvent />} />} />
          <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
          <Route
            path="/my-event/:eventId" // Dynamic route for event details
            element={<ProtectedRoute element={<MyEvent />} />}
          />
          <Route path="/samridhi" element={<ProtectedRoute element={<Samridhi />} />} />
          <Route path="/users/overview" element={<ProtectedRoute element={<UserOverview />} />} />
          <Route path="/users/add" element={<ProtectedRoute element={<AddUser />} />} />
          <Route path="/server" element={<ProtectedRoute element={<Server />} />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<ForbiddenPage />} /> {/* Add the 403 route */}

          {/* Catch-all Route (Optional) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WebSocketContext.Provider>
  );
}

export default App;