// routes/userOverview.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/overview/details
// Returns details (name, role, event_relation, mobile) for coordinators only
router.get('/details', async (req, res) => {
  try {
    const coordinators = await User.find(
      { role: { $in: ["coor", "coordinator"] } },
      "name role event_relation mobile"
    );
    res.status(200).json({ users: coordinators });
  } catch (error) {
    console.error('Error fetching coordinator details:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
