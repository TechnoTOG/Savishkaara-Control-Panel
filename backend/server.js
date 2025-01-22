require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const https = require("https"); // Import the http module
const mongoConnect = require("./db/mongodb"); // MongoDB connection utility

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

const AuthenticationRoutes = require("./routes/auth");

// Middleware
app.use(cors());
app.use(express.json());

app.use("/", AuthenticationRoutes);

// Fetch public IP
https.get("https://api.ipify.org", (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Your public IP address is: " + data);
  });
}).on("error", (e) => {
  console.log("Error: " + e.message);
});

// MongoDB connection
mongoConnect(); 

// Simple route
app.get('/', (req, res) => {
  res.send('TechFest Admin Panel API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
