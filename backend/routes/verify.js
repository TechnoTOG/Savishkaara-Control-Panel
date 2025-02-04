const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
    ticketID: { type: String },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    attendence: { type: Number, required: true   },
    event: { type: String },
    DateTime: { type: TimeRanges }
});

const Participant = mongoose.model('User', ParticipantSchema, 'users');

// Password update route (if needed)
router.post('/verify-ticket', async (req, res) => {
    const { ticketID } = req.body;

    try {
        // Find user by username
        const participant = await Participant.findOne({ ticketID: ticketID });

        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Update user's attendence
        participant.attendence = 1;
        await participant.save();

        return res.status(200).json({ message: 'Participant attendance marked successfully successfully' });
    } catch (error) {
        console.error('Participant attendence Error:', error);
        return res.status(500).json({
            error: 'There was an issue updating the participant attendence. Please contact the Administrator/Technical Team.',
        });
    }
});

module.exports = router;