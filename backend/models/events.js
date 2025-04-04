const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  date_time: { type: Date, required: true }, // Combined date and time
  form_link: { type: String, required: true },
  excel_link: { type: String, required: true },
  coordinators: { 
    type: [String],  // Array of strings
    required: true,
    validate: [arrayLimit, '{PATH} must have at least 1 coordinator']
  },
  faculty_coordinators: { 
    type: [String],  // Array of strings
    required: true,
    validate: [arrayLimit, '{PATH} must have at least 1 faculty coordinator']
  },
  status: { type: String, required: true },
  venue: { type: String, required: true }
}, { collection: "events" });

// Custom validator for array length
function arrayLimit(val) {
  return val.length >= 1;
}

// Export the Event model
module.exports = mongoose.model('Event', eventSchema);