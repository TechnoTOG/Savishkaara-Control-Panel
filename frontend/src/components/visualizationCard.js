import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

const VisualizationCard = ({ title, children, height, width, marginRight, icon }) => {
  return (
    <Card sx={{ height: height, width: width, marginRight: marginRight, position: "relative", overflow: "visible" }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>

      {/* Icon inside a #4D55CC circle on the right side */}
      {icon && (
        <Avatar
          sx={{
            bgcolor: "#4D55CC", // Light gray background
            color: "#e0e0e0", // #4D55CC outline color
            
            width: 40,
            height: 40,
            position: "absolute",
            top: 10,
            right: 10,
            border: "2px solid #4D55CC", // #4D55CC border for outline effect
          }}
        >
          {icon}
        </Avatar>
      )}
    </Card>
  );
};

export default VisualizationCard;
