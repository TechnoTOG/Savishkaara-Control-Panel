import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const VisualizationCard = ({ title, children, height,width,marginRight }) => {
  return (
    <Card sx={{height:height,width:width,marginRight:marginRight}}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default VisualizationCard;