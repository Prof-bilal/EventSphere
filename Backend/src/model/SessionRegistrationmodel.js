const mongoose = require("mongoose");

const sessionRegistrationSchema = new mongoose.Schema({
    attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    createdAt: { type: Date, default: Date.now }
});

sessionRegistrationSchema.index({ attendeeId: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model("SessionRegistration", sessionRegistrationSchema);
