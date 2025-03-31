import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import CountUp from "react-countup";

const MetricCardData = ({
  title,
  value,
  darkMode,
  height,
  width,
  description,
  additionalInfo,
  bgColor,
  textColor,
  children,
  action,
  onClick,
}) => {
  const isNumeric = !isNaN(Number(value));
  const defaultTextColor = textColor || "#fff";

  return (
    <Card
      sx={{
        
        backgroundColor: bgColor || (darkMode ? "#1b1c1e" : "rgba(255, 255, 255, 0.1)"),
        borderRadius: 2,
        marginRight: "30px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        height,
        width: "100%",
        maxWidth: "100%",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: `0px 0px 15px ${bgColor ? bgColor : "#00e676"}`,
          transform: "none", // No scaling effect
        },
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        margin: "10px 0",
      }}
      onClick={onClick}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Title & Value Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: "20px", fontWeight: "600", color: defaultTextColor, mb: 1 }}>
            {title}
          </Typography>
          {value !== undefined && (
            <Typography variant="h5" sx={{ fontSize: "16px", fontWeight: "600", color: defaultTextColor, mb: 2 }}>
              {isNumeric ? <CountUp end={Number(value)} duration={2} separator="," /> : value}
            </Typography>
          )}
          {description && (
            <Typography variant="body2" sx={{ color: defaultTextColor, mt: 1 }}>
              {description}
            </Typography>
          )}
        </Box>

        {/* Optional Action or Link */}
        {action || additionalInfo ? (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {action ? (
              action
            ) : (
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
                <ArrowForward sx={{ ml: 1, color: defaultTextColor }} />
              </a>
            )}
          </Box>
        ) : null}

        {/* Child content area (e.g., your table) */}
        {children && (
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderRadius: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

MetricCardData.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  darkMode: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
  description: PropTypes.string,
  additionalInfo: PropTypes.node,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
  onClick: PropTypes.func,
};

MetricCardData.defaultProps = {
  height: "100%",
  width: "100%",
  bgColor: "rgba(0,0,0,0.2)",
  textColor: "#fff",
};

export default MetricCardData;
