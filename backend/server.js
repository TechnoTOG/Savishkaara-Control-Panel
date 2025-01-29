require("dotenv").config(); // Load environment variables
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const https = require("https"); // Import the http module
const http = require("http"); 
const mongoConnect = require("./db/mongodb"); // MongoDB connection utility

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Generate a secure secret for session signing
const sessionSecret = crypto.randomBytes(64).toString("hex");

// Middleware for sessions
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour expiration
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

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

// Create HTTP server using Express
const server = http.createServer(app);

// Create WebSocket server attached to the same HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  // Log client IP address and other details
  const clientIp = req.socket.remoteAddress; // This will give the IP address of the client
  const userAgent = req.headers['user-agent']; // Get the User-Agent header for client details
  const timestamp = new Date().toISOString(); // Get the connection timestamp

  console.log(`New WebSocket connection`);
  console.log(`Client IP: ${clientIp}`);
  console.log(`User-Agent: ${userAgent}`);
  console.log(`Connection Timestamp: ${timestamp}`);

  // Send a welcome message to the client
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

  // Listen for incoming messages from the client
  ws.on("message", (message) => {
    console.log("Received message:", message);

    // Here you can send a response back to the client, if necessary
    ws.send(JSON.stringify({ message: `Server received: ${message}` }));
  });

  // Handle WebSocket disconnection
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the server on the specified port
server.listen(PORT, () => {
  console.log(`:'######:::::'###::::'##::::'##:'####:::::::::::'######:::'#######::'##::: ##:'########:'########:::'#######::'##:::::::::::::::::'######::'########:'########::'##::::'##:'########:'########::
'##... ##:::'## ##::: ##:::: ##:. ##:::::::::::'##... ##:'##.... ##: ###:: ##:... ##..:: ##.... ##:'##.... ##: ##::::::::::::::::'##... ##: ##.....:: ##.... ##: ##:::: ##: ##.....:: ##.... ##:
 ##:::..:::'##:. ##:: ##:::: ##:: ##::::::::::: ##:::..:: ##:::: ##: ####: ##:::: ##:::: ##:::: ##: ##:::: ##: ##:::::::::::::::: ##:::..:: ##::::::: ##:::: ##: ##:::: ##: ##::::::: ##:::: ##:
. ######::'##:::. ##: ##:::: ##:: ##::'#######: ##::::::: ##:::: ##: ## ## ##:::: ##:::: ########:: ##:::: ##: ##:::::::'#######:. ######:: ######::: ########:: ##:::: ##: ######::: ########::
:..... ##: #########:. ##:: ##::: ##::........: ##::::::: ##:::: ##: ##. ####:::: ##:::: ##.. ##::: ##:::: ##: ##:::::::........::..... ##: ##...:::: ##.. ##:::. ##:: ##:: ##...:::: ##.. ##:::
'##::: ##: ##.... ##::. ## ##:::: ##::::::::::: ##::: ##: ##:::: ##: ##:. ###:::: ##:::: ##::. ##:: ##:::: ##: ##::::::::::::::::'##::: ##: ##::::::: ##::. ##:::. ## ##::: ##::::::: ##::. ##::
. ######:: ##:::: ##:::. ###::::'####::::::::::. ######::. #######:: ##::. ##:::: ##:::: ##:::. ##:. #######:: ########::::::::::. ######:: ########: ##:::. ##:::. ###:::: ########: ##:::. ##:
:......:::..:::::..:::::...:::::....::::::::::::......::::.......:::..::::..:::::..:::::..:::::..:::.......:::........::::::::::::......:::........::..:::::..:::::...:::::........::..:::::..::`);
  console.log("\nWelcome to Savishkaara-Control-Server\n");
  console.log(`Date:        `,new Date().toLocaleDateString());
  console.log(`Time:        `,new Date().toLocaleTimeString());
  console.log(`TimeStamp:   `,new Date(),`\n`);
  console.log(`HTTP server running on port ${PORT}`);
});