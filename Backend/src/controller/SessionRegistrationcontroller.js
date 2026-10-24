const SessionRegistration = require("../model/SessionRegistrationmodel");
const Session = require("../model/Sessionmodel");
const Registration = require("../model/expoRegistrationsmodel");
const { notifyUser } = require("../services/NotificationService");

const registerSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.status !== "active") return res.status(400).json({ message: "Session is inactive" });
        const registered = await Registration.findOne({ attendeeId: req.user.id, expoId: session.expoId, status: "registered" });
        if (!registered) return res.status(400).json({ message: "Register for the expo first" });
        const count = await SessionRegistration.countDocuments({ sessionId: session._id });
        if (count >= session.capacity) return res.status(400).json({ message: "Session is full" });
        const registration = await SessionRegistration.create({ attendeeId: req.user.id, sessionId: session._id, expoId: session.expoId });
        req.app.get("io")?.emit("event:updated", { expoId: session.expoId });
        await notifyUser(req.app.get("io"), {
            userId: req.user.id, title: "Session registered", message: `You are registered for ${session.title} at ${session.startTime}.`, type: "session", relatedExpoId: session.expoId, email: false
        });
        return res.status(201).json(registration);
    } catch (error) {
        return res.status(400).json({ message: error.code === 11000 ? "Already registered for this session" : error.message });
    }
};

const getMySessions = async (req, res) => {
    try {
        const registrations = await SessionRegistration.find({ attendeeId: req.user.id }).populate("sessionId");
        return res.status(200).json(registrations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const cancelSession = async (req, res) => {
    try {
        const registration = await SessionRegistration.findOneAndDelete({ attendeeId: req.user.id, sessionId: req.params.id });
        if (!registration) return res.status(404).json({ message: "Registration not found" });
        req.app.get("io")?.emit("event:updated", { expoId: registration.expoId });
        return res.status(200).json({ message: "Session registration cancelled" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { registerSession, getMySessions, cancelSession };
