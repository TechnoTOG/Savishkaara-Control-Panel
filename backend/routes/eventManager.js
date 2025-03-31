const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Ensure the correct MongoDB connection (saavishkaara-aio database)
const mongoConnect = require('../db/mongodb');

// Import the Event and Event_reg models
const Event = require('../models/events'); // Updated import name to match the model
const Event_reg = require('../models/event_registration');

/**
 * GET /events-count
 * Fetch the total number of event registrations and the count of verified registrations.
 * 
 * Response:
 * {
 *   "totalRegistrations": Number,       // Total number of registrations
 *   "verifiedRegistrations": Number    // Count of registrations where verified = true
 * }
 */
router.get("/events-count", async (req, res) => {
  try {
    const totalRegistrations = await Event_reg.countDocuments();
    const verifiedRegistrations = await Event_reg.countDocuments({ verified: true });

    res.status(200).json({
      totalRegistrations,
      verifiedRegistrations,
    });
  } catch (error) {
    console.error("Error fetching registration counts:", error);
    res.status(500).json({
      error: "An error occurred while fetching registration counts.",
      details: error.message,
    });
  }
});

// Route to add a new event
router.post('/addEvent', async (req, res) => {
  try {
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

    if (!name || !venue || !dateAndTime || !fee || !coor1 || !facoor1 || !flinik || !elink) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEvent = new Event({
      name,
      venue,
      date_time: new Date(dateAndTime),
      fee,
      coordinator1: coor1,
      coordinator2: coor2,
      faculty_coor1: facoor1,
      faculty_coor2: facoor2,
      form_link: flinik,
      excel_link: elink,
      status: "upcoming",
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: "Event added successfully", event: savedEvent });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Failed to add event", details: error.message });
  }
});

// Route to fetch all events (with specific fields: name, venue, coordinator1, and _id)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({}, { name: 1, venue: 1, coordinator1: 1, _id: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events", details: error.message });
  }
});

/**
 * GET /events/:eventId
 * Fetch details of a specific event by its _id.
 * 
 * Parameters:
 * - eventId: The unique ID of the event.
 * 
 * Response:
 * - If the event is found, returns the event object.
 * - If the event is not found, returns a 404 error.
 */
router.get('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate if eventId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // Fetch the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details", details: error.message });
  }
});

/**
 * GET /events-revenue
 * Calculate and return the revenue generated for each event.
 * 
 * Response:
 * [
 *   { "name": "Nerd Script", "revenue": 200 },
 *   { "name": "Coding", "revenue": 50 }
 * ]
 */
router.get('/events-revenue', async (req, res) => {
  try {
    console.log("Starting /events-revenue route...");

    // Step 1: Log raw Event_reg data to verify its structure
    const rawEventData = await Event_reg.find({});
    console.log("Raw Event_reg data:", JSON.stringify(rawEventData, null, 2));

    // Step 2: Aggregate revenue grouped by event name
    console.log("Aggregating revenue from ticket_details...");
    const revenueData = await Event_reg.aggregate([
      {
        $match: {
          "ticket_details.amount": { $exists: true, $ne: null }, // Filter out invalid amounts
        },
      },
      {
        $group: {
          _id: "$ticket_details.event", // Group by the nested `event` field in ticket_details
          revenue: {
            $sum: { $toInt: "$ticket_details.amount" }, // Convert amount to integer before summing
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the `_id` field from the output
          name: "$_id", // Rename `_id` to `name`
          revenue: 1, // Include the calculated revenue
        },
      },
    ]);

    console.log("Revenue data after aggregation:", JSON.stringify(revenueData, null, 2));

    // Step 3: Validate the revenue data
    if (!revenueData || revenueData.length === 0) {
      console.warn("No revenue data found after aggregation.");
    }

    // Step 4: Return the revenue data as a JSON response
    console.log("Returning revenue data to the client...");
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Failed to fetch revenue data", details: error.message });
  }
});

module.exports = router;