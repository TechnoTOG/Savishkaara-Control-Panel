import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const MetricCard = ({ title, value }) => (
  <Card
    sx={{
      backgroundColor: "#f7f7f7",  // Light background color
      borderRadius: 2,  // Rounded corners
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",  // Subtle shadow
      padding: "20px",
      transition: "all 0.3s ease",  // Smooth transition
      "&:hover": {
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",  // Bigger shadow on hover
        backgroundColor: "#e9e9e9",  // Slightly darker shade on hover
      },
    }}
  >
    <CardContent>
      <Typography variant="h6" color="textSecondary">{title}</Typography>
      <Typography variant="h4" color="primary">{value}</Typography>
    </CardContent>
  </Card>
);

export default MetricCard;
