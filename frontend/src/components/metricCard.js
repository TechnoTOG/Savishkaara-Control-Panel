import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import CountUp from "react-countup"; // Import CountUp

const MetricCard = ({ title, value, darkMode }) => (
  <Card
    sx={{
      backgroundColor: darkMode ? "#1b1c1e" : "#f7f7f7",  // Light background color
      borderRadius: 2,  // Rounded corners
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",  // Subtle shadow
      padding: "20px",
      transition: "all 0.3s ease",  // Smooth transition
      "&:hover": {
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",  // Bigger shadow on hover
        backgroundColor: "#2f3134",  // Slightly darker shade on hover
      },
    }}
  >
    <CardContent>
      <Typography variant="h6" sx={{fontSize:"16px", fontWeight: "600", color: darkMode ? "#787878" :"#8d8c8c",}}>{title}</Typography>
      <Typography variant="h5" sx={{fontSize:"26px", fontWeight: "600", color: darkMode ? "#a9a9a9" :"#000",}}>
        <CountUp
          end={value} // The target number to animate to
          duration={2} // Duration of the animation in seconds
          separator="," // Add a comma separator for thousands
        />
      </Typography>
    </CardContent>
  </Card>
);

export default MetricCard;
