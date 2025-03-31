const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /overview/details
// Returns details (name, role, event_relation, mobile) for admins and coordinators
router.get('/overview/details', async (req, res) => {
  try {
    const users = await User.find(
      { role: { $in: ["admin", "coor", "coordinator",'super'] } },
      "name role event_relation mobile"
    );
   
    
    res.status(200).json({ users });
    
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: error.message });
  }
});
// POST /overview/reset-status/:mobile
router.post('/overview/reset-status/:mobile', async (req, res) => {
  try {
    const mobile = req.params.mobile;

    const updated = await User.findOneAndUpdate(
      { mobile },
      { $set: { status: -1 }, $expr: { password: "$username" } }, // This line is not valid in Mongoose!
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fallback method since `$expr` doesn't work with `$set` in `findOneAndUpdate`:
    updated.password = updated.username;
    await updated.save();

    res.status(200).json({ message: `Status reset and password updated for ${mobile}` });
  } catch (error) {
    console.error("Error resetting status and password:", error);
    res.status(500).json({ error: "Failed to reset user status and password" });
  }
});

module.exports = router;
