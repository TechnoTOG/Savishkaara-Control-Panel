import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2"; // Import both Bar and Doughnut components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Required for doughnut charts
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const VisualizationCard = ({ title, data, options, value, height = "100%", width = "100%", chartType = "bar" }) => {
  return (
    <Card
      sx={{
        height,
        width,
        transition: "all 0.3s ease-in-out",
        boxShadow: "0px 4px 8px rgba(32, 24, 24, 0.1)",
        backgroundColor: "#ffffff", // Default white
        "&:hover": {
          boxShadow: "0px 8px 16px rgba(17, 15, 15, 0.2)",
          transform: "scale(1.03)",
          backgroundColor: "#f0f0f0", // Slightly darkened white
        },
      }}
    >
      <CardContent>
        {/* Title */}
        <Typography variant="h6" gutterBottom sx={{ textAlign: "left", pl: 13 }}>
        {title}
        </Typography>

        {/* Conditional Rendering */}
        {value !== undefined ? (
          // Display numeric value with smaller font size and center alignment
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginTop: "16px", fontWeight: "bold" }}
          >
            {value}
          </Typography>
        ) : data && options ? (
          // Render the appropriate chart type based on the `chartType` prop
          chartType === "doughnut" ? (
            <Doughnut data={data} options={options} />
          ) : chartType === "bar" ? (
            <Bar data={data} options={options} />
          ) : (
            // Fallback message if chartType is unsupported
            <Typography variant="body2" sx={{ textAlign: "center", marginTop: "16px" }}>
              Chart type not supported
            </Typography>
          )
        ) : (
          // Fallback message if neither value nor chart data is provided
          <Typography variant="body2" sx={{ textAlign: "center", marginTop: "16px" }}>
            No data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Define prop types for type checking
VisualizationCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object, // For charts
  options: PropTypes.object, // For charts
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // For numeric values
  height: PropTypes.string,
  width: PropTypes.string,
  chartType: PropTypes.oneOf(["bar", "doughnut"]), // Add support for chartType prop
};

// Default props
VisualizationCard.defaultProps = {
  height: "100%",
  width: "100%",
  chartType: "bar", // Default chart type is "bar"
};

export default VisualizationCard;