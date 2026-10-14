const Registration = require("../model/expoRegistrationsmodel");
const Expo = require("../model/expomodel");
const User = require("../model/Usermodel");
const { notifyUser } = require("../services/NotificationService");

const registerForExpo = async (req, res) => {
    try {
        const { expoId } = req.params;
        const attendeeId = req.user.id;
        const registrationNumber = Math.floor(100000000 + Math.random() * 900000000);
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: "Expo not found" });
        }
        const user = await User.findById(attendeeId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isRegistered = await Registration.findOne({ attendeeId, expoId });
        if (isRegistered) {
            return res.status(400).json({ message: "User already registered for this expo" });
        }

        if (expo.startDate) {
            const currenttime = Date.now();
            const originalStartdate = new Date(expo.startDate);
            const twodayinms = 24 * 60 * 60 * 1000;
            if (originalStartdate - currenttime <= twodayinms) {
                return res.status(400).json({ message: "Sorry, You can't register for this expo as it is scheduled to be held within 2 days." })
            }
        }

        const registration = await Registration.create({
            expoId,
            attendeeId,
            registrationNumber,
            status: "registered"
        });
        await notifyUser(req.app.get("io"), {
            userId: attendeeId,
            title: "Expo registration successful",
            message: `You are registered for ${expo.title}.`,
            type: "registration",
            relatedExpoId: expoId
        });

        return res.status(201).json({ message: "Registered for expo successfully", registration });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getRegistrationById = async (req, res) => {
    try {
        const { expoId } = req.params;
        const attendeeId = req.user.id;
        const registration = await Registration.findOne({ expoId, attendeeId });
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        return res.status(200).json(registration);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getAllRegistration = async (req, res) => {
    try {
        const registrations = await Registration.find().populate("expoId", "title").populate("attendeeId", "name");
        return res.status(200).json(registrations);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const cancelRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findById(id).populate("expoId", "startDate");
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        if (registration.attendeeId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to cancel this registration" });
        }

        if (registration.expoId && registration.expoId.startDate) {
            const currenttime = Date.now();
            const originalStartdate = new Date(registration.expoId.startDate);
            const onedayinms = 24 * 60 * 60 * 1000;
            if (originalStartdate - currenttime <= onedayinms) {
                return res.status(400).json({ message: "Sorry, You can't cancel this registration as it is scheduled to be held within 24 hours." })
            }
        }
        registration.status = "cancelled";
        await registration.save();
        return res.status(200).json({ message: "Registration cancelled successfully", registration });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const attendeeCount = async (req, res) => {
    try {
        const { expoId } = req.params;
        const registrations = await Registration.find({ expoId, status: "registered" });
        return res.status(200).json({ count: registrations.length });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const markAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findById(id);
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        if (registration.status === "cancelled") {
            return res.status(400).json({ message: "Cannot mark attendance for a cancelled registration" });
        }
        registration.attendanceStatus = "present";
        await registration.save();
        return res.status(200).json({ message: "Attendance marked successfully", registration });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    registerForExpo,
    getRegistrationById,
    getAllRegistration,
    cancelRegistration,
    attendeeCount,
    markAttendance
}
