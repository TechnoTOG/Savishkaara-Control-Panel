import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VisualizationCard = ({ title, data, options, height = "100%", width = "100%" }) => {
  return (
    <Card sx={{ height, width }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {data && options ? (
          <Bar data={data} options={options} />
        ) : (
          <Typography variant="body2">No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Define prop types for type checking
VisualizationCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  options: PropTypes.object,
  height: PropTypes.string,
  width: PropTypes.string,
};

// Default props
VisualizationCard.defaultProps = {
  height: "100%",
  width: "100%",
};

export default VisualizationCard;
