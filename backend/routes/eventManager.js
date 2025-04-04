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
router.get("/events/by-name/:name", async (req, res) => {
  try {
    const event = await Event.findOne({ name: req.params.name });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event by name:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/events/by-coordinator/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const event = await Event.find({
      $or: [
        { coordinator1: { $regex: new RegExp("^" + username + "$", "i") } },
        { coordinator2: { $regex: new RegExp("^" + username + "$", "i") } },
      ],
    });

    if (!event) return res.status(404).json({ error: "Event not found for this coordinator" });
    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event by coordinator:", err);
    res.status(500).json({ error: "Internal server error" });
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
router.post("/events/update-status-by-name", async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name || !status) {
      return res.status(400).json({ error: "Name and status are required" });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { name: name },
      { status: status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error" });
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

    // Step 1: Aggregate revenue grouped by event name
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
            $sum: { $toDouble: "$ticket_details.amount" }, // Convert amount to integer before summing
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

    // Step 2: Validate the revenue data
    if (!revenueData || revenueData.length === 0) {
      console.warn("No revenue data found after aggregation.");
    }

    // Step 3: Return the revenue data as a JSON response
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Failed to fetch revenue data", details: error.message });
  }
});

/**
 * GET /registration-trend
 * Fetch the number of registrations grouped by event.
 * 
 * Response:
 * [
 *   { "event": "SAVISHKAARA2K25", "count": 50 },
 *   { "event": "Nerd Script", "count": 30 },
 *   ...
 * ]
 */
  router.post("/events/update-details-by-name", async (req, res) => {
  try {
    const { name, venue, date_time, fee, coordinator1, coordinator2, faculty_coor1, faculty_coor2, form_link } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Event name is required" });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { name },
      {
        venue,
        date_time,
        fee,
        coordinator1,
        coordinator2,
        faculty_coor1,
        faculty_coor2,
        form_link,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    console.error("Error updating event details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/registration-trend', async (req, res) => {
  try {
    console.log("Starting /registration-trend route...");

    // Aggregate registrations grouped by event
    const trendData = await Event_reg.aggregate([
      {
        $match: {
          "ticket_details.event": { $exists: true }, // Ensure the event field exists
        },
      },
      {
        $group: {
          _id: "$ticket_details.event", // Group by the nested `event` field in ticket_details
          count: { $sum: 1 }, // Count registrations for each event
        },
      },
      {
        $project: {
          _id: 0, // Exclude the `_id` field
          event: "$_id", // Rename `_id` to `event`
          count: 1,
        },
      },
      {
        $sort: { count: -1 }, // Sort by registration count in descending order
      },
    ]);

    console.log("Registration trend data:", JSON.stringify(trendData, null, 2));

    // Validate the trend data
    if (!trendData || trendData.length === 0) {
      console.warn("No registration trend data found.");
    }

    // Return the trend data as a JSON response
    res.status(200).json(trendData);
  } catch (error) {
    console.error("Error fetching registration trend data:", error);
    res.status(500).json({ error: "Failed to fetch registration trend data", details: error.message });
  }
});

/**
 * GET /top-events
 * Fetch the top 5 events with the highest number of registrations.
 * 
 * Response:
 * [
 *   { "event": "SAVISHKAARA2K25", "count": 50 },
 *   { "event": "Nerd Script", "count": 30 },
 *   { "event": "Coding Challenge", "count": 20 },
 *   ...
 * ]
 */
router.get('/top-events', async (req, res) => {
  try {
    console.log("Starting /top-events route...");

    // Aggregate registrations grouped by event and sort by count in descending order
    const topEvents = await Event_reg.aggregate([
      {
        $match: {
          "ticket_details.event": { $exists: true }, // Ensure the event field exists
        },
      },
      {
        $group: {
          _id: "$ticket_details.event", // Group by the nested `event` field in ticket_details
          count: { $sum: 1 }, // Count registrations for each event
        },
      },
      {
        $project: {
          _id: 0, // Exclude the `_id` field
          event: "$_id", // Rename `_id` to `event`
          count: 1,
        },
      },
      {
        $sort: { count: -1 }, // Sort by registration count in descending order
      },
      {
        $limit: 5, // Limit to the top 5 events
      },
    ]);

    console.log("Top events data:", JSON.stringify(topEvents, null, 2));

    // Validate the trend data
    if (!topEvents || topEvents.length === 0) {
      console.warn("No top events data found.");
    }

    // Return the top events data as a JSON response
    res.status(200).json(topEvents);
  } catch (error) {
    console.error("Error fetching top events data:", error);
    res.status(500).json({ error: "Failed to fetch top events data", details: error.message });
  }
});
/**
 * GET /ongoing-events
 * Fetch all events with status = "ongoing".
 */
router.get('/ongoing-events', async (req, res) => {
  try {
    console.log("Starting /ongoing-events route...");
    const ongoingEvents = await Event.find(
      { status: "ongoing" },
      { name: 1, venue: 1,  _id: 0 }
    );
    console.log("Ongoing events data:", JSON.stringify(ongoingEvents, null, 2));
    if (!ongoingEvents || ongoingEvents.length === 0) {
      console.warn("No ongoing events found.");
    }
    res.status(200).json(ongoingEvents);
  } catch (error) {
    console.error("Error fetching ongoing events data:", error);
    res.status(500).json({ error: "Failed to fetch ongoing events data", details: error.message });
  }
});
module.exports = router;