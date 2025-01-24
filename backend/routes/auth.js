const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Ensure the correct MongoDB connection (saavishkaara-aio database)
const mongoConnect = require('../db/mongodb');

// Define your User schema (if not already defined in a separate model file)
const UserSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true  },
    status: { type: Number, required: true },
    dept: { type: String },
    event: { type: String },
});

const User = mongoose.model('User', UserSchema, 'users'); // Connecting to the 'users' collection

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
        if (user.status === -1 && user.password == password) {
            req.session.username = user.username;
            req.session.user_role = user.role;
            req.session.name = user.name;
            req.session.department = user.dept;
            req.session.event = user.event;

            return res.status(200).json({ redirectToUpdatePassword: true });
        }
        
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json( { error: 'Invalid username or password' });
        }

        // Set session variables if necessary (you might need session middleware)
        req.session.username = user.username;
        req.session.user_role = user.role;
        req.session.name = user.name;
        req.session.department = user.dept;
        req.session.event = user.event;

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            error: 'There was an issue with logging in. Please try again later.',
        });
    }
});

// Check authentication route
router.get("/check-auth", (req, res) => {
    if (req.session.username) {
      res.json({ isAuthenticated: true, user: req.session.username });
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
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password Update Error:', error);
        return res.status(500).json({
            error: 'There was an issue updating your password. Please try again later.',
        });
    }
});

module.exports = router;
