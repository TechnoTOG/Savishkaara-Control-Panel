const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // using bcryptjs for hashing

// Import the User model
const User = require('../models/User');
// Import the Event model to fetch distinct events for the coordinator form
const Event = require('../models/events'); // Ensure this path is correct

// GET /api/users/distinctEvents
// Returns a list of distinct event names from the events collection
router.get('/distinctEvents', async (req, res) => {
  try {
    const events = await Event.distinct('name');
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error retrieving distinct events:", error);
    res.status(500).json({ error: "Failed to retrieve distinct events", details: error.message });
  }
});

// POST /api/users/addUser
// Adds a new user based on role-specific form structure.
// For coordinators, the frontend should send a field "event_relation", which is stored in event_relation.
router.post('/addUser', async (req, res) => {
  try {
    // Extract common fields from the request body
    const { name, username, gender, role, mobile } = req.body;
    // For super/admin, expect "dept"; for coordinator, expect "event_relation"
    const dept = req.body.dept;  
    const event_relation = req.body.event_relation; 

    // Validate common required fields
    if (!name || !username || !gender || !role || !mobile) {
      return res.status(400).json({ error: "Name, username, gender, role, and mobile are required." });
    }

    // Role-specific validations:
    const lowerRole = role.trim().toLowerCase();
    if (lowerRole === "coor" || lowerRole === "coordinator") {
      if (!event_relation) {
        return res.status(400).json({ error: "Event is required for coordinator role." });
      }
    } else if (lowerRole === "super" || lowerRole === "admin") {
      if (!dept) {
        return res.status(400).json({ error: "Department is required for admin and super roles." });
      }
    }

    // Generate an initial encrypted password using bcrypt hash of the username
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(username, saltRounds);

    // Create a new user document:
    // For coordinators, assign event_relation with the provided event value.
    const newUser = new User({
      name,
      username,
      password: encryptedPassword,
      mobile: Number(mobile),
      role,dept: (lowerRole === "coor" || lowerRole === "coordinator") ? "" : dept,
      event_relation: (lowerRole === "coor" || lowerRole === "coordinator") ? event_relation : "none",
      status: 0, // Always active by default
      gender
      
      

    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User added successfully", user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user", details: error.message });
  }
  
});

module.exports = router;
