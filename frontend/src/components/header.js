import React from "react";
import "./header.css";

const Navbar = ({ toggleSidebar }) => {
  const name = sessionStorage.getItem('userName');
  const gender = sessionStorage.getItem('gender');
  const dept = sessionStorage.getItem('dept');
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