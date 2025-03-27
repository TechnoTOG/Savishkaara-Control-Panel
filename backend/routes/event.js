const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the User model 
const Events = require('../models/events');
const Event_reg = require('../models/event_registration');

router.get("/events-count", async (req, res) => {
  try {
    const count = await Event_reg.countDocuments();
    res.status(200).json({ count: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/addEvent', (req, res) => {
    const { name, venue,  dateAndTime, fee, coor1, coor2, facoor1, facoor2, flinik, elink } = req.body;

});

module.exports = router;