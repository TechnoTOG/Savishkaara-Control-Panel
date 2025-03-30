const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    mobile: {type: Number, required: true },
    status: { type: Number, required: true },
    dept: { type: String },
    event_relation: { type: String },
    gender: { type: String }
}, { collection: "users" });

module.exports = mongoose.model('User', UserSchema);
