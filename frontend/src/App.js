import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import UpdatePassword from "./pages/updatePassword";

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
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update-password" element={<ProtectedRoute element={<UpdatePassword />} />} />
      </Routes>
    </Router>
  );
}

export default App;
