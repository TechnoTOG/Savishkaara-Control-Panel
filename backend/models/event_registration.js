const mongoose = require('mongoose');

// Define the event registration schema
const EventSchema = new mongoose.Schema({
    // Personal Details
    roll_number: { type: String, required: true },
    batch:       { type: String, required: true },
    year:        { type: Number, required: true },
    name:        { type: String, required: true },
    phone_no:    { type: Number, required: true },

    // Event Details
    event_name:  { type: String, required: true },
    ticket_id:   { type: String, required: true },

    // Registration & Verification Timestamps
    date_time:            { type: Date, required: true }, // Registration date and time
    attendance:           { type: Boolean, default: false },
    attendance_date_time: { type: Date } // Ticket verification date and time
}, { collection: "event_registration" });

// Export the Event Registration model
module.exports = mongoose.model('Event_registrations', EventSchema);