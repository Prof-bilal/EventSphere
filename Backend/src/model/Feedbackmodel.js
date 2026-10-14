const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expo",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: ["suggestion", "complaint", "technical"],
        required: true
    },
    status: {
        type: String,
        enum: ["new", "in-progress", "resolved"],
        default: "new"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
