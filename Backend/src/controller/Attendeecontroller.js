const Registration = require("../model/expoRegistrationsmodel");
const Bookmark = require("../model/Bookmarkmodel");
const Notification = require("../model/Notificationmodel");

const getDashboard = async (req, res) => {
    try {
        const attendeeId = req.user.id;
        const [registrations, bookmarks, notifications] = await Promise.all([
            Registration.find({ attendeeId }).populate("expoId", "title startDate endDate location"),
            Bookmark.find({ attendeeId }).populate("sessionId"),
            Notification.find({ userId: attendeeId }).sort({ createdAt: -1 }).limit(10)
        ]);

        return res.status(200).json({
            summary: {
                registrations: registrations.length,
                bookmarks: bookmarks.length,
                unreadNotifications: notifications.filter((notification) => !notification.isRead).length
            },
            registrations,
            bookmarks,
            notifications
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getDashboard };

