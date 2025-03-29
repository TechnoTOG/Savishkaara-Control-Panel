require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express.js
const session = require("express-session"); // Import Express Session
const crypto = require("crypto"); // Import Crypto.js
const { Server } = require("socket.io"); // Socket.io for realtime updates
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

// Only run these production checks if NODE_ENV is "production"
if (process.env.NODE_ENV === "production") {
  // Force HTTPS redirect
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  });

  // Check for allowed origin header
  app.use((req, res, next) => {
    if (req.headers['X-Allowed-Origin'] !== 'testsavi.amritaiedc.site') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  });
}

// Session middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: "pookie",
    cookie: {
      maxAge: 1000 * 60 * 60 * 6, // 6 hour expiration
      secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      httpOnly: true,
    },
  })
);

// Configure CORS dynamically
const allowedOrigins = [
  "https://testsavi.amritaiedc.site",
  "http://localhost:3000",
  "https://savicontrol.amritaiedc.site",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Check if the origin is allowed
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Import and mount routes
const AuthenticationRoutes = require("./routes/auth");
const EventRoutes = require("./routes/eventManager");
const UserAdd = require("./routes/addusers");
const RealTimeRoutes = require("./routes/realTime");
const VerificationRoutes = require("./routes/verify");
const userOverviewRoutes = require('./routes/userOVERVIEW');



app.use("/", AuthenticationRoutes);
app.use("/", EventRoutes);
app.use("/", UserAdd);
app.use("/", RealTimeRoutes);
app.use("/", VerificationRoutes);
app.use('/', userOverviewRoutes);
// Optional: Log public IP
https.get("https://api.ipify.org", (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => { console.log("Your public IP address is: " + data); });
}).on("error", (e) => { console.log("Error: " + e.message); });

// Connect to MongoDB
mongoConnect();

// Create HTTP server and configure Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
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
