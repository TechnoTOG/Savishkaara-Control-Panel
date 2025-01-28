import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const VisualizationCard = ({ title, children }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default VisualizationCard;