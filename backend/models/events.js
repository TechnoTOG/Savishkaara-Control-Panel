const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  date_time: { type: Date, required: true }, // Combined date and time
  form_link: { type: String, required: true },
  excel_link: { type: String, required: true },
  coordinator1: { type: String, required: true },
  coordinator2: { type: String, required: true },
  faculty_coor1: { type: String, required: true },
  faculty_coor2: { type: String, required: true },
  status: { type: String, required: true },
  venue: { type: String, required: true }
}, { collection: "events"});

// Export the User model
module.exports = mongoose.model('Event', eventSchema);
