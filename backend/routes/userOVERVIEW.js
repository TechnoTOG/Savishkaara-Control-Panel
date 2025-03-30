const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /overview/details
// Returns details (name, role, event_relation, mobile) for admins and coordinators
router.get('/overview/details', async (req, res) => {
  try {
    const users = await User.find(
      { role: { $in: ["admin", "coor", "coordinator"] } },
      "name role event_relation mobile"
    );
    console.log("Found users:", users);
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /overview/details/:name
// Updates a user’s name, mobile, and event_relation using the user's name as the key.
router.put('/overview/details/:name', async (req, res) => {
  try {
    const { name, mobile, event_relation } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { name: req.params.name },
      { name, mobile, event_relation },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /overview/details/:name
// Deletes a user using the user's name as the key.
router.delete('/overview/details/:name', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ name: req.params.name });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
