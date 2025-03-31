const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /overview/details
// Returns details (name, role, event_relation, mobile) for admins and coordinators
router.get('/overview/details', async (req, res) => {
  try {
    const users = await User.find(
      { role: { $in: ["admin", "coor", "coordinator","super"] } },
      "name role event_relation mobile"
    );
    console.log("Found users:", users);
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
