const Expo = require("../model/expomodel");
const Registration = require("../model/expoRegistrationsmodel");
const ExhibitorApplication = require("../model/exhibitorApplicationmodel");
const Booth = require("../model/boothmodel");
const Sessions = require("../model/Sessionmodel");
const Feedback = require("../model/Feedbackmodel");
const SessionRegistration = require("../model/SessionRegistrationmodel");
const Bookmark = require("../model/Bookmarkmodel");

const getAnalytics = async (req, res) => {
    try {
        const { expoId } = req.params;
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: "Expo not found" });
        }

        const [attendees, exhibitors, booths, availableBooths, bookedBooths, sessions, feedback] = await Promise.all([
            Registration.countDocuments({ expoId, status: "registered" }),
            ExhibitorApplication.countDocuments({ expoId, ApplicationStatus: "Approved" }),
            Booth.countDocuments({ expoId }),
            Booth.countDocuments({ expoId, status: "available" }),
            Booth.countDocuments({ expoId, status: "booked" }),
            Sessions.countDocuments({ expoId }),
            Feedback.countDocuments({ expoId })
        ]);

        const sessionList = await Sessions.find({ expoId });
        const popularity = await Promise.all(sessionList.map(async session => ({
            title: session.title,
            registrations: await SessionRegistration.countDocuments({ sessionId: session._id }),
            bookmarks: await Bookmark.countDocuments({ sessionId: session._id })
        })));
        const boothTraffic = await Booth.find({ expoId }).select("boothNumber visits");
        return res.status(200).json({
            expo: { id: expo._id, title: expo.title },
            attendees,
            exhibitors,
            booths,
            availableBooths,
            bookedBooths,
            sessions,
            feedback,
            popularity,
            boothTraffic
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getAnalytics };

