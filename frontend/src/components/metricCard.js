import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material"; // Import Arrow Icon
import CountUp from "react-countup";

const MetricCard = ({ title, value, darkMode, height, width, description, additionalInfo }) => {
  const isNumeric = !isNaN(Number(value));

  return (
    <Card
      sx={{
        backgroundColor: darkMode ? "#1b1c1e" : "#f7f7f7",
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        height: height,
        width: width,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#2f3134",
        },
      }}
    >
      <CardContent>
        {/* Event Name */}
        <Typography variant="h6" sx={{ fontSize: "20px", fontWeight: "600", color: darkMode ? "#787878" : "#8d8c8c" }}>
          {title}
        </Typography>

        {/* Venue or Numeric Value */}
        <Typography variant="h5" sx={{ fontSize: "16px", fontWeight: "600", color: darkMode ? "#a9a9a9" : "#000" }}>
          {isNumeric ? <CountUp end={Number(value)} duration={2} separator="," /> : value}
        </Typography>

        {/* Coordinator */}
        {description && (
          <Typography variant="body2" sx={{ color: darkMode ? "#a9a9a9" : "#000", marginTop: "8px" }}>
            {description}
          </Typography>
        )}

        {/* Additional Info (View Link Aligned to Right with Bright Blue Color and Arrow) */}
        {additionalInfo && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <a
              href={`/events/${title.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                textDecoration: "none",
                color: "#007BFF", // Bright Blue Color
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              View
              <ArrowForward sx={{ marginLeft: "5px", color: "#007BFF" }} /> {/* Bright Blue Arrow */}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
