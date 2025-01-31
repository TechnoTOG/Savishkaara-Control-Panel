import React, { useState, useEffect } from "react";
import "../css/header.css";

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const name = sessionStorage.getItem('userName');
  const gender = sessionStorage.getItem('gender');
  const dept = sessionStorage.getItem('dept');

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img 
          src={darkMode ? 
            "\\Icons\\menu_24dp_a2a4a6_FILL0_wght400_GRAD0_opsz24.svg" : 
            "\\Icons\\menu_24dp_44464b_FILL0_wght400_GRAD0_opsz24.svg"
          } 
          alt="Menu" 
          className="hamburger-menu" 
          onClick={toggleSidebar} 
        />
        <span className="navbar-title">Dashboard</span>
      </div>

      <div className="navbar-profile">
        <img 
          src={darkMode ? 
            "\\Icons\\light_mode_24dp_a2a4a6_FILL0_wght400_GRAD0_opsz24.svg" : 
            "\\Icons\\dark_mode_24dp_44464b_FILL0_wght400_GRAD0_opsz24.svg"
          } 
          alt={darkMode ? "Dark Mode" : "Light Mode"} 
          onClick={toggleDarkMode}
          style={{ cursor: 'pointer' }}
        />
        <img 
          src={darkMode ? 
            "Icons\\notifications_24dp_a2a4a6_FILL0_wght400_GRAD0_opsz24.svg" : 
            "Icons\\notifications_24dp_44464b_FILL0_wght400_GRAD0_opsz24.svg"
          } 
          alt="Notifications" />
        <img src={gender === "female" ? "/profile/female2.png" : "/profile/male_avatar.png"} alt="User" className="profile-pic" />
        <div className="profile-info">
          <span className="profile-name">{name ? name : "Guest"}</span>
          <span className="profile-role">{dept}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;