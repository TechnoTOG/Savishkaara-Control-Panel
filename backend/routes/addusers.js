// addusers.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Import the User model
const User = require('../models/User');

// Route to add a new user
router.post('/addUser', async (req, res) => {
  try {
    // Extract data from the request body
    const { name, username, gender, role, dept, mobile, status } = req.body;
    
    // Validate required fields (adjust as needed)
    if (!name || !username || !gender || !role || !mobile) {
      return res.status(400).json({ error: "Name, username, gender, role, and mobile are required." });
    }
    
    // Generate an initial encrypted password using SHA-256 of the username
    const encryptedPassword = crypto.createHash('sha256').update(username).digest('hex');
    
    // Create a new user document. 
    // Convert mobile to a number, set status to 1 for "active" or 0 for "inactive"
    const newUser = new User({
      name: name,
      username: username,
      password: encryptedPassword,
      mobile: Number(mobile),
      role: role,
      status: status === "active" ? 1 : 0,
      dept: dept || "",
      event_relation: "none", // Default value as specified
      gender: gender,
    });
    
    // Save the user to the database
    const savedUser = await newUser.save();
    
    // Respond with the saved user data
    res.status(201).json({ message: "User added successfully", user: savedUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user", details: error.message });
  }
});

module.exports = router;
