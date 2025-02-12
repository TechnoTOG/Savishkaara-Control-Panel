import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "../css/header.css";

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode, title }) => {
  const name = Cookies.get("userName");
  const gender = Cookies.get("gender");
  const department = Cookies.get("dept");

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img 
          src={darkMode ? 
            "\\icons\\menu_24dp_A2A4A6_FILL0_wght400_GRAD0_opsz24.svg" : 
            "\\icons\\menu_24dp_44464B_FILL0_wght400_GRAD0_opsz24.svg"
          } 
          alt="Menu" 
          className="hamburger-menu" 
          onClick={toggleSidebar} 
        />
        <span className="navbar-title">{title}</span>
      </div>

      <div className="navbar-profile">
        <img 
          src={darkMode ? 
            "\\icons\\light_mode_24dp_A2A4A6_FILL0_wght400_GRAD0_opsz24.svg" : 
            "\\icons\\dark_mode_24dp_44464B_FILL0_wght400_GRAD0_opsz24.svg"
          } 
          alt={darkMode ? "Dark Mode" : "Light Mode"} 
          onClick={toggleDarkMode}
          style={{ cursor: 'pointer' }}
        />
        <img 
          src={darkMode ? 
            "icons\\notifications_24dp_A2A4A6_FILL0_wght400_GRAD0_opsz24.svg" : 
            "icons\\notifications_24dp_44464B_FILL0_wght400_GRAD0_opsz24.svg"
          } 
          alt="Notifications" />
        <img src={gender === "female" ? "/profile/female2.png" : "/profile/male_avatar.png"} alt="User" className="profile-pic" />
        <div className="profile-info">
          <span className="profile-name">{name ? name : "Guest"}</span>
          <span className="profile-role">{department}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;