import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import CountUp from "react-countup";

const MetricCard = ({ 
  title, 
  value, 
  darkMode, 
  height, 
  width, 
  description, 
  additionalInfo, 
  bgColor, 
  textColor,
  action,
  onClick
}) => {
  const isNumeric = !isNaN(Number(value));
  const defaultTextColor = textColor || "#fff";

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
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flexGrow: 1 }}> {/* This pushes the action to the bottom */}
          <Typography variant="h6" sx={{ fontSize: "20px", fontWeight: "600", color: defaultTextColor }}>
            {title}
          </Typography>

          <Typography variant="h5" sx={{ fontSize: "16px", fontWeight: "600", color: defaultTextColor }}>
            {isNumeric ? <CountUp end={Number(value)} duration={2} separator="," /> : value}
          </Typography>

          {description && (
            <Typography variant="body2" sx={{ color: defaultTextColor, marginTop: "8px" }}>
              {description}
            </Typography>
          )}
        </Box>

        {/* Centered Action Area */}
        <Box sx={{ 
          marginTop: "16px",
          display: "flex",
          justifyContent: "center", // Changed from 'flex-end' to 'center'
          alignItems: "center",
          width: '100%'
        }}>
          {action ? (
            action
          ) : additionalInfo ? (
            <a
              href={`/events/${title.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                textDecoration: "none",
                color: defaultTextColor,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              View
              <ArrowForward sx={{ marginLeft: "5px", color: defaultTextColor }} />
            </a>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;