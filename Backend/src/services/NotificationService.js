const Notification = require("../model/Notificationmodel");
const User = require("../model/Usermodel");
const { sendNotificationEmail } = require("./BrevoServices");

const notifyUser = async (io, data) => {
    try {
        const { userId, title, message, type, relatedExpoId, email = true } = data;
        const user = await User.findById(userId).select("name email");
        if (!user) {
            return null;
        }

        const notification = await Notification.create({
            userId,
            title,
            message,
            type,
            relatedExpoId
        });

        if (io) {
            io.to(userId.toString()).emit("notification:new", notification);
        }

        if (email && user.email) {
            await sendNotificationEmail(user.email, user.name, title, title, message);
        }

        return notification;
    }
    catch (error) {
        console.error("NOTIFICATION ERROR:", error.message);
        return null;
    }
}

module.exports = { notifyUser };
