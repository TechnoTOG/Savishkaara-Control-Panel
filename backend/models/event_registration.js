const mongoose = require('mongoose');

// Define the event registration schema
const EventSchema = new mongoose.Schema({
    ticket_id: { type: String, required: true },
    name: { type: String, required: true },
    phone_no: { type: Number, required: true },
    event_name: { type: String, required: true },
    attendance: { type: Boolean, default: false },
    date_time: { type: Date, required: true }
}, { collection: "event_regstration" });

// Export the User model
module.exports = mongoose.model('Event_registrations', EventSchema);
