const Feedback = require("../model/Feedbackmodel");
const Expo = require("../model/expomodel");

const createFeedback = async (req, res) => {
    try {
        const { expoId, rating, comment, category } = req.body;
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: "Expo not found" });
        }
        const feedback = await Feedback.create({ userId: req.user.id, expoId, rating, comment, category });
        return res.status(201).json({ message: "Feedback submitted successfully", feedback });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate("userId", "name email").populate("expoId", "title");
        return res.status(200).json(feedback);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const updateFeedbackStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        return res.status(200).json({ message: "Feedback status updated successfully", feedback });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { createFeedback, getFeedback, updateFeedbackStatus };
