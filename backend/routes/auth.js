const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Ensure the correct MongoDB connection (saavishkaara-aio database)
const mongoConnect = require('../db/mongodb');

// Import the User model 
const User = require('../models/User');

// User login authentication route
router.post('/login-auth', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check user status and redirect
    if (user.status === -1 && user.password === password) {
      req.session.objectID = user._id;
      req.session.username = user.username;
      req.session.user_role = user.role;
      req.session.name = user.name;
      req.session.department = user.dept;
      req.session.event = user.event;
      req.session.gender = user.gender;

      console.log(`----------New Login----------`);
      console.log(`_id  : ${user._id}`);
      console.log(`Name : ${user.name}`);
      console.log(`Dept.: ${user.dept}`);
      console.log(`Event: ${user.event}`);
      return res.status(200).json({
        redirectToUpdatePassword: true,
        objectID: user._id,
        name: user.name,
        gender: user.gender,
        department: user.dept,
        role: user.role,
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Set session variables if necessary (you might need session middleware)
    req.session.objectID = user._id;
    req.session.username = user.username;
    req.session.user_role = user.role;
    req.session.name = user.name;
    req.session.department = user.dept;
    req.session.event = user.event;
    req.session.gender = user.gender;

    console.log(`----------New Login----------`);
    console.log(`_id : ${user._id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Dept: ${user.dept}`);
    if (user.role === "coor") {
      console.log(`Event: ${user.event}`);
    }
    console.log(`-----------------------------`);

    return res.status(200).json({
      message: 'Login successful',
      objectID: user._id,
      name: user.name,
      gender: user.gender,
      department: user.dept,
      role: user.role,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      error: 'There was an issue with logging in. Please try again later.',
    });
  }
});

// Check authentication route
router.get('/check-auth', (req, res) => {
  if (req.session.username) {
    res.json({
      isAuthenticated: true,
      objectID: req.session.objectID,
      name: req.session.name,
      gender: req.session.gender,
      department: req.session.department,
      role: req.session.user_role,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Password update route (if needed)
router.post('/update-password', async (req, res) => {
  const { password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username: req.session.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Encrypt and update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.status = 1;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password Update Error:', error);
    return res.status(500).json({
      error: 'There was an issue updating your password. Please try again later.',
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  const userData = {
    userId: req.session.objectID,
    userName: req.session.name,
    department: req.session.department,
    role: req.session.user_role,
    eventAssigned: req.session.user_role === "coor" ? req.session.event : null,
  };

  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    // Clear the session cookie
    res.clearCookie('pookie');

    console.log(`----------User Logout----------`);
    console.log(`_id : ${userData.userId}`);
    console.log(`Name: ${userData.userName}`);
    console.log(`Dept: ${userData.department}`);
    if (userData.role === "coor") {
      console.log(`Event: ${userData.eventAssigned}`);
    }
    console.log(`-------------------------------`);

    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;