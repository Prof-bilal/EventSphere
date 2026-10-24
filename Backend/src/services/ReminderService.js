const Bookmark = require("../model/Bookmarkmodel");
const { notifyUser } = require("./NotificationService");

const sendReminders = async (io) => {
    try {
        const bookmarks = await Bookmark.find({ reminderSentAt: null }).populate("sessionId");
        for (const bookmark of bookmarks) {
            const session = bookmark.sessionId;
            if (!session || session.status !== "active") continue;
            const start = new Date(session.startDate);
            const [hours, minutes] = session.startTime.split(":").map(Number);
            start.setHours(hours, minutes, 0, 0);
            const remaining = start.getTime() - Date.now();
            if (remaining < 0 || remaining > 30 * 60 * 1000) continue;
            const notification = await notifyUser(io, {
                userId: bookmark.attendeeId,
                title: "Your bookmarked session starts soon",
                message: `${session.title} starts at ${session.startTime} in ${session.location || "the event venue"}.`,
                type: "reminder",
                relatedExpoId: session.expoId,
                email: false
            });
            if (notification) { bookmark.reminderSentAt = new Date(); await bookmark.save(); }
        }
    } catch (error) { console.error("Reminder error:", error.message); }
};

module.exports = { sendReminders };
