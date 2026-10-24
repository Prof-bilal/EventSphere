const Exhibitor = require("../model/exhibitorProfilemodel");
const Registration = require("../model/expoRegistrationsmodel");
const Feedback = require("../model/Feedbackmodel");
const User = require("../model/Usermodel");
const Message = require("../model/Messagemodel");

const getMyProfile = async (req, res) => {
    try {
        const profile = await Exhibitor.findOne({ UserId: req.user.id });
        return res.status(200).json(profile);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ attendeeId: req.user.id }).populate("expoId", "title location startDate");
        return res.status(200).json(registrations);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getMyFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ userId: req.user.id }).populate("expoId", "title");
        return res.status(200).json(feedback);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getContacts = async (req, res) => {
    try {
        const incoming = await Message.distinct("senderId", { receiverId: req.user.id });
        const filter = { _id: { $ne: req.user.id }, IsActive: true, IsBlocked: false };
        if (req.user.role !== "admin") filter.$or = [{ role: { $in: ["admin", "exhibitor"] } }, { _id: { $in: incoming } }];
        const users = await User.find(filter).select("name email role");
        return res.status(200).json(users);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

module.exports = { getMyProfile, getMyRegistrations, getMyFeedback, getContacts };
