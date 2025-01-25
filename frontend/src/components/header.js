import React from "react";
import "./header.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img 
          src="\Icons\menu_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" 
          alt="Menu" 
          className="hamburger-menu" 
          onClick={toggleSidebar} 
        />
        <span className="navbar-title">Dashboard</span>
      </div>

      <div className="navbar-icons">
        <img src="\Icons\dark_mode_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="Dark Mode" />
        <img src="Icons\notifications_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="Notifications" />
      </div>

      <div className="navbar-profile">
        <img src="/images/profile.png" alt="User" className="profile-pic" />
        <div className="profile-info">
          <span className="profile-name">Json Taylor</span>
          <span className="profile-role">Web Designer</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;