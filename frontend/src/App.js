import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import UpdatePassword from "./pages/updatePassword";
import ForbiddenPage from "./pages/forbidden"; // Import the 403 page component

// Function to check authentication status
const checkAuth = async () => {
  try {
    const response = await fetch("/check-auth", {
      credentials: "include", // Important to send cookies
    });
    const data = await response.json();
    return data.isAuthenticated;
  } catch (error) {
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/update-password" element={<ProtectedRoute element={<UpdatePassword />} />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<ForbiddenPage />} /> {/* Add the 403 route */}

        {/* Catch-all Route (Optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;