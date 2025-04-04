const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Ensure the correct MongoDB connection (saavishkaara-aio database)
const mongoConnect = require('../db/mongodb');

// Import the Event and Event_reg models
const Event = require('../models/events');
const Event_reg = require('../models/event_registration');

/**
 * GET /events-count
 * Fetch the total number of event registrations and the count of verified registrations.
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
      coordinators,
      facultyCoordinators,
      registrationLink,
      excelLink
    } = req.body;

    if (!name || !venue || !dateAndTime || !fee || 
        !coordinators || coordinators.length === 0 ||
        !facultyCoordinators || facultyCoordinators.length === 0) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newEvent = new Event({
      name,
      venue,
      date_time: new Date(dateAndTime),
      fee,
      coordinators, // Array of names
      faculty_coordinators: facultyCoordinators, // Array of names
      form_link: registrationLink,
      excel_link: excelLink,
      status: "upcoming",
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ 
      message: "Event added successfully", 
      event: savedEvent 
    });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ 
      error: "Failed to add event", 
      details: error.message 
    });
  }
});

/**
 * GET /events/by-name/:name
 * Fetch event by name
 */
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

/**
 * GET /events/by-coordinator/:username
 * Fetch events by coordinator username
 */
router.get("/events/by-coordinator/:username", async (req, res) => {
  try {
    const username = req.params.username
    
    // Find events where the username exists in either coordinators or faculty_coordinators arrays
    const events = await Event.find({
      $or: [
        { coordinators: username }, // Exact match in coordinators array
        { faculty_coordinators: username } // Exact match in faculty_coordinators array
      ]
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ 
        error: "No events found for this username",
        details: `Username '${username}' not found in coordinators or faculty coordinators`
      });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events by coordinator:", err);
    res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
});
/**
 * GET /events
 * Fetch all events (with specific fields)
 */
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({}, { 
      name: 1, 
      venue: 1, 
      coordinators: 1, 
      _id: 1,
      status: 1,
      date_time: 1
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events", details: error.message });
  }
});

/**
 * POST /events/update-status-by-name
 * Update event status by name
 */
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
 * Fetch event by ID
 */
router.get('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

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
 * Calculate event revenue
 */
router.get('/events-revenue', async (req, res) => {
  try {
    const revenueData = await Event_reg.aggregate([
      {
        $match: {
          "ticket_details.amount": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$ticket_details.event",
          revenue: {
            $sum: { $toDouble: "$ticket_details.amount" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          revenue: 1,
        },
      },
    ]);

    if (!revenueData || revenueData.length === 0) {
      console.warn("No revenue data found after aggregation.");
    }

    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Failed to fetch revenue data", details: error.message });
  }
});

/**
 * POST /events/update-details-by-name
 * Update event details by name
 */
router.post("/events/update-details-by-name", async (req, res) => {
  try {
    const { 
      name, 
      venue, 
      date_time, 
      fee, 
      coordinators, 
      faculty_coordinators, 
      form_link,
      excel_link
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Event name is required" });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { name },
      {
        venue,
        date_time,
        fee,
        coordinators,
        faculty_coordinators,
        form_link,
        excel_link
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

/**
 * GET /registration-trend
 * Get registration trends
 */
router.get('/registration-trend', async (req, res) => {
  try {
    const trendData = await Event_reg.aggregate([
      {
        $match: {
          "ticket_details.event": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$ticket_details.event",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          event: "$_id",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    if (!trendData || trendData.length === 0) {
      console.warn("No registration trend data found.");
    }

    res.status(200).json(trendData);
  } catch (error) {
    console.error("Error fetching registration trend data:", error);
    res.status(500).json({ error: "Failed to fetch registration trend data", details: error.message });
  }
});

/**
 * GET /top-events
 * Get top 5 events by registration
 */
router.get('/top-events', async (req, res) => {
  try {
    const topEvents = await Event_reg.aggregate([
      {
        $match: {
          "ticket_details.event": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$ticket_details.event",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          event: "$_id",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    if (!topEvents || topEvents.length === 0) {
      console.warn("No top events data found.");
    }

    res.status(200).json(topEvents);
  } catch (error) {
    console.error("Error fetching top events data:", error);
    res.status(500).json({ error: "Failed to fetch top events data", details: error.message });
  }
});

/**
 * GET /ongoing-events
 * Get ongoing events
 */
router.get('/ongoing-events', async (req, res) => {
  try {
    const ongoingEvents = await Event.find(
      { status: "ongoing" },
      { name: 1, venue: 1, _id: 0 }
    );
    
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