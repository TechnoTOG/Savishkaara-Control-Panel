const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: Number, required: true },
    dept: { type: String },
    event: { type: String },
    gender: { type: String }
}, { collection: "users" });

// Export the User model
module.exports = mongoose.model('User', UserSchema);