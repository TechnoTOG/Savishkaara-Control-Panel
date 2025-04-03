// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET /api/users/coordinators
router.get('/coordinators', async (req, res) => {
  try {
    const coordinators = await User.find(
      { role: { $regex: /^coor/i } },
      { name: 1, username: 1, _id: 0 }
    );
    res.status(200).json({ coordinators });
  } catch (error) {
    console.error("Error retrieving coordinators:", error);
    res.status(500).json({ error: "Failed to retrieve coordinators", details: error.message });
  }
});

module.exports = router;
