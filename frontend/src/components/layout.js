import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import "../css/dashboard.css"; // Ensure this CSS file contains styles for dark mode and layout

const Layout = ({ children, title }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === null
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : storedDarkMode === "true";
  });

  // Toggle sidebar minimized state
  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  // Initialize dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }

    const systemPreferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemPreferenceChange = (e) => {
      const newDarkMode = e.matches;
      setDarkMode(newDarkMode);
      localStorage.setItem("darkMode", newDarkMode);
      if (newDarkMode) {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }
    };

    systemPreferenceQuery.addEventListener("change", handleSystemPreferenceChange);
    return () => {
      systemPreferenceQuery.removeEventListener("change", handleSystemPreferenceChange);
    };
  }, [darkMode]);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} darkMode={darkMode} />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          transition: "margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease",
          marginLeft: isMinimized ? "80px" : "250px",
          minHeight: "100vh",
          backgroundColor: "transparent",
          color: darkMode ? "#ffffff" : "#000000",
          willChange: "margin-left, color",
        }}
      >
        {/* Background Wrapper */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: darkMode ? "#262729" : "#f0f1f6",
            transition: "background-color 0.3s ease",
            zIndex: -1,
          }}
        />

        {/* Header */}
        <Header
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          title={title}
        />

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;