import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import CountUp from "react-countup";

const MetricCard = ({ title, value, darkMode, height, width, description, additionalInfo, bgColor }) => {
  const isNumeric = !isNaN(Number(value));

  return (
    <Card
      sx={{
        backgroundColor: bgColor || (darkMode ? "#1b1c1e" : "#f7f7f7"),
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(32, 24, 24, 0.1)",
        padding: "20px",
        height: height,
        width: width,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: `0px 0px 15px ${bgColor ? bgColor : "#00e676"}`,
          transform: "scale(1.05)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}>
          {title}
        </Typography>

        <Typography variant="h5" sx={{ fontSize: "16px", fontWeight: "600", color: "#fff" }}>
          {isNumeric ? <CountUp end={Number(value)} duration={2} separator="," /> : value}
        </Typography>

        {description && (
          <Typography variant="body2" sx={{ color: "#fff", marginTop: "8px" }}>
            {description}
          </Typography>
        )}

        {additionalInfo && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <a
              href={`/events/${title.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                textDecoration: "none",
                color: "#fff",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              View
              <ArrowForward sx={{ marginLeft: "5px", color: "#fff" }} />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
