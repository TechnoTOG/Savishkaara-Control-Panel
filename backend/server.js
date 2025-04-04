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
const os = require('os');
const pidusage = require('pidusage');
const si = require('systeminformation'); // For system-wide metrics

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Generate a secure secret for session signing
const sessionSecret = crypto.randomBytes(64).toString("hex");

// Track server start time
const SERVER_START_TIME = Date.now();
let serverStatus = 'online'; // "normal": all pages accessible, "restricted": only allowed pages, "offline": no pages (except API) available

function restrictAccess(req, res, next) {
  // Always allow API endpoints
  if (req.originalUrl.startsWith('/api/')) return next();

  // If server is offline, render the offline page for all non-API routes.
  if (serverStatus === 'offline') {
    return res.render('offline'); // Create an offline.ejs view.
  }

  // If server is restricted, allow only certain pages.
  if (serverStatus === 'restricted') {
    const isAllowed = allowedPathsRestricted.some(prefix =>
      req.originalUrl.startsWith(prefix)
    );
    if (!isAllowed) {
      return res.render('notAllowed'); // Create a notAllowed.ejs view.
    }
  }
  next();
}

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
    if (req.headers['X-Allowed-Origin'] !== 'savishkaara.in') {
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
  "http://localhost:3000",
  "https://control.savishkaara.in",
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

// Apply the restricted access middleware (apply before routes)
app.use(restrictAccess);

// Parse JSON bodies
app.use(express.json());

// Import and mount routes
const AuthenticationRoutes = require("./routes/auth");
const EventRoutes = require("./routes/eventManager");
const userRoutes = require('./routes/users');
const UserAdd = require("./routes/addusers");
const userOverviewRoutes = require('./routes/userOVERVIEW');

const RealTimeRoutes = require("./routes/realTime");
const VerificationRoutes = require("./routes/verify");




app.use("/", AuthenticationRoutes);
app.use("/", EventRoutes);
app.use('/', userRoutes);
app.use("/", UserAdd);
app.use('/', userOverviewRoutes);


app.use("/", RealTimeRoutes);
app.use("/", VerificationRoutes);

// API endpoint to update server status (e.g., normal, restricted, offline)
app.post('/update-server-status', (req, res) => {
  // Trim status to remove extra whitespace if any.
  serverStatus = req.body.status.trim();
  console.log('Server status updated to: ', serverStatus);
  res.sendStatus(200);
});

// API endpoint to fetch current server status (mode)
app.get('/status', async (req, res) => {
  try {
    // Calculate uptime
    const uptimeMs = Date.now() - SERVER_START_TIME;
    const uptimeStr = formatUptime(uptimeMs);

    // Get process-specific metrics (CPU and memory usage)
    const processStats = await pidusage(process.pid);

    // Get system-wide CPU usage
    const cpuData = await si.currentLoad();

    // Get memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Prepare response data
    const data = {
      system_metrics: {
        cpu_usage_percent: cpuData.currentLoad.toFixed(2),
        process: {
          cpu_usage_percent: processStats.cpu.toFixed(2),
          memory_usage_mb: (processStats.memory / (1024 ** 2)).toFixed(2)
        },
        memory: {
          total_gb: (totalMemory / (1024 ** 3)).toFixed(2),
          used_gb: (usedMemory / (1024 ** 3)).toFixed(2),
          usage_percent: ((usedMemory / totalMemory) * 100).toFixed(2)
        },
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        uptime: uptimeStr
      },
    };

    const response = {
      data: data,
      valid: true,
      message: "Server is running",
      mode: serverStatus
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching server status:", error);
    res.status(500).json({
      valid: false,
      message: "Failed to fetch server status",
      error: error.message
    });
  }
});

// API endpoint to fetch the current mode
app.get('/mode', (req, res) => {
  res.status(200).json({ mode: serverStatus });
});

// Helper function to format uptime as HH:MM:SS
function formatUptime(uptimeMs) {
  const totalSeconds = Math.floor(uptimeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

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
    methods: ["GET", "POST","PATCH"],
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
