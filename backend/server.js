require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express.js
const session = require("express-session"); // Import Express Session
const crypto = require("crypto"); // Import Crypto.js
const { Server } = require("socket.io"); // Using the Server class from the socket.io module for realtime update
const cors = require("cors"); // Import CORS middleware
const https = require("https"); // Import HTTPS module
const http = require("http"); // Import HTTP module
const mongoConnect = require("./db/mongodb"); // Import MongoDB connection
const path = require("path");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Generate a secure secret for session signing
const sessionSecret = crypto.randomBytes(64).toString("hex");

// Force HTTPS redirect (Only if using Cloudflare Full mode)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  });

  app.use((req, res, next) => {
    if (req.headers['X-Allowed-Origin'] !== 'testsavi.amritaiedc.site') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  });
}

// Middleware for sessions
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: "pookie",
    cookie: {
      maxAge: 1000 * 60 * 60 * 6, // 6 hour expiration
      secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
      httpOnly: true,
    },
  })
);

// Import routes
const AuthenticationRoutes = require("./routes/auth"); // Import authentication routes
const RealTimeRoutes = require("./routes/realTime");
const VerificationRoutes = require("./routes/verify");
const EventRoutes = require("./routes/event");

// Define allowed origins
const allowedOrigins = [
  "https://testsavi.amritaiedc.site",
  "http://localhost:3000",
  "https://savicontrol.amritaiedc.site",
];

// Configure CORS dynamically
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }

      // Allow the request
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Middleware
app.use(express.json());
app.use("/", AuthenticationRoutes);
app.use("/", RealTimeRoutes);
app.use("/", VerificationRoutes);
app.use("/", EventRoutes);

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

// Create HTTP server using Express
const server = http.createServer(app);

// Configure Socket.io with dynamic CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }

      // Allow the request
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials
  },
});

// Export the `io` object
module.exports.io = io;

// Initialize room updater
const roomUpdater = require("./routes/roomUpdater");
roomUpdater(io);

// Start the server
server.listen(PORT, () => {
  console.log(`
  ____              _     _     _                                ____            _             _      ____                           
 / ___|  __ ___   _(_)___| |__ | | ____ _  __ _ _ __ __ _       / ___|___  _ __ | |_ _ __ ___ | |    / ___|  ___ _ ____   _____ _ __ 
 \\___ \\ / _\` \\ \\ / / / __| '_ \\| |/ / _\` |/ _\` | '__/ _\` |_____| |   / _ \\| '_ \\| __| '__/ _ \\| |____\\___ \\ / _ \\ '__\\ \\ / / _ \\ '__|
  ___) | (_| |\\ V /| \\__ \\ | | |   < (_| | (_| | | | (_| |_____| |__| (_) | | | | |_| | | (_) | |_____|__) |  __/ |   \\ V /  __/ |   
 |____/ \\__,_| \\_/ |_|___/_| |_|_|\\_\\__,_|\\__,_|_|  \\__,_|      \\____\\___/|_| |_|\\__|_|  \\___/|_|    |____/ \\___|_|    \\_/ \\___|_|   
                                                                                                                                     `);
  console.log("\nWelcome to Savishkaara-Control-Server\n");
  console.log(`Date:        `, new Date().toLocaleDateString());
  console.log(`Time:        `, new Date().toLocaleTimeString());
  console.log(`TimeStamp:   `, new Date(), `\n`);
  console.log(`HTTP server running on port ${PORT}`);
  console.log(`Socket.io server initialized`);
});