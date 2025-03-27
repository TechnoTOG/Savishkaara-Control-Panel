const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Event = require('../models/event_registration');

router.get("/events-count", async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.status(200).json({ count: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;