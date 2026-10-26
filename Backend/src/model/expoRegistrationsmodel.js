const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    attendeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expo",
        required: true
    },
    registrationNumber : {
        type : Number,
        unique : true,
    },
    badgeNumber: {
        type: String,
    },
    boothNumber: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    organization: {
        type: String,
        trim: true,
    },
    jobTitle: {
        type: String,
        trim: true,
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["registered", "cancelled"],
        default: "registered"
    },
    attendanceStatus: {
        type: String,
        enum: ["present", "no-show"],
        default: "no-show"
    }
});

registrationSchema.index({ attendeeId: 1, expoId: 1 }, { unique: true });

const ExpoRegistrations = mongoose.model("ExpoRegistration", registrationSchema);
module.exports = ExpoRegistrations;
