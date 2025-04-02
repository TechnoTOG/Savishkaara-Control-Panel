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
  gradient, // New prop for gradient colors
  textColor,
  action,
  onClick,
  children, // Explicitly handle children
}) => {
  const isNumeric = !isNaN(Number(value));
  const defaultTextColor = textColor || "#fff";

  // Determine background style (gradient or solid color)
  const backgroundStyle = gradient
    ? {
        backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }
    : {
        backgroundColor: bgColor || (darkMode ? "#1b1c1e" : "#f7f7f7"),
      };

  return (
    <Card
      sx={{
        ...backgroundStyle, // Apply gradient or solid background
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(32, 24, 24, 0.1)",
        padding: "20px",
        minHeight: height, // Use minHeight instead of height
        maxHeight: height, // Optional: Cap the maximum height
        width: width,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: `0px 0px 15px ${
            gradient ? gradient[1] : bgColor ? bgColor : "#00e676"
          }`,
          transform: "scale(1.05)",
        },
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        overflow: "visible", // Remove scrollbar by setting overflow to visible
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "10px", // Reduce padding to free up space
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "20px", fontWeight: "600", color: defaultTextColor }}
          >
            {title}
          </Typography>

          {/* Render numeric or non-numeric value */}
          <Typography
            variant="h5"
            sx={{ fontSize: "16px", fontWeight: "600", color: defaultTextColor }}
          >
            {isNumeric ? (
              <CountUp end={Number(value)} duration={2} separator="," />
            ) : (
              value
            )}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              sx={{ color: defaultTextColor, marginTop: "8px" }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Render children (e.g., List component) */}
        {children && (
          <Box
            sx={{
              marginTop: "16px",
              maxHeight: "calc(100% - 100px)", // Ensure children don't overflow
              overflow: "visible", // Remove scrollbar by setting overflow to visible
            }}
          >
            {children}
          </Box>
        )}

        {/* Action Area */}
        <Box
          sx={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
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