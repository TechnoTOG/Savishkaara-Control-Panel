import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import "../css/dashboard.css";

const Layout = ({ children, title, activePage }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === null
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : storedDarkMode === "true";
  });

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) setSidebarOpen(false); // Hide sidebar on mobile
      else setSidebarOpen(true); // Show by default on desktop
    };

    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setIsMinimized((prev) => !prev);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.documentElement.classList.toggle("dark-mode", newDarkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div style={{ display: "flex", position: "relative" }}>
  {/* Sidebar */}
  {sidebarOpen && (
    <div
      style={{
        position: isMobile ? "fixed" : "fixed", // Overlay on mobile
        zIndex: 1000,
        top: 0,
        left: 0,
        height: "100vh",
        width: isMinimized ? "80px" : "250px",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Sidebar
        isMinimized={isMinimized}
        darkMode={darkMode}
        activePage={activePage}
      />
    </div>
  )}

  {/* Main Content */}
  <div
    style={{
      flex: 1,
      transition: "margin-left 0.6s ease",
      marginLeft: !isMobile && sidebarOpen ? (isMinimized ? "80px" : "250px") : "0",
      minHeight: "100vh",
      backgroundColor: darkMode ? "#262729" : "#f0f1f6",
      color: darkMode ? "#ffffff" : "#000000",
      overflow: "hidden",
    }}
  >
    {/* Optional dark background */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: darkMode ? "#262729" : "#f0f1f6",
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
    <div className="content-container">{children}</div>
  </div>
</div>
  );
};

export default Layout;
