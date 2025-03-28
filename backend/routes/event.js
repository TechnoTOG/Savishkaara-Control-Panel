const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the Event and Event_reg models
const Event = require('../models/events'); // Updated import name to match the model
const Event_reg = require('../models/event_registration');

// Route to get the count of event registrations
router.get("/events-count", async (req, res) => {
  try {
    const count = await Event_reg.countDocuments();
    res.status(200).json({ count: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new event
router.post('/addEvent', async (req, res) => {
  try {
    // Extract data from the request body
    const { 
      name, 
      venue, 
      dateAndTime, 
      fee, 
      coor1, 
      coor2, 
      facoor1, 
      facoor2, 
      flinik, 
      elink
    } = req.body;

    // Validate required fields
    if (!name || !venue || !dateAndTime || !fee || !coor1 || !facoor1 || !flinik || !elink) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new event document
    const newEvent = new Event({
      name: name,
      venue: venue,
      date_time: new Date(dateAndTime), // Convert string to Date object
      fee: fee,
      coordinator1: coor1,
      coordinator2: coor2,
      faculty_coor1: facoor1,
      faculty_coor2: facoor2,
      form_link: flinik,
      excel_link: elink,
      status: "upcoming"
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();

    // Respond with the saved event
    res.status(201).json({ message: "Event added successfully", event: savedEvent });
  } catch (error) {
    // Handle errors
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Failed to add event", details: error.message });
  }
});

module.exports = router;