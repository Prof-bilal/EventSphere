const Notification = require("../model/Notificationmodel");
const User = require("../model/Usermodel");
const { notifyUser } = require("../services/NotificationService");

const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type, relatedExpoId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const notification = await notifyUser(req.app.get("io"), { userId, title, message, type, relatedExpoId });
        return res.status(201).json({ message: "Notification created successfully", notification });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json(notifications);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification marked as read", notification });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { createNotification, getNotifications, markNotificationRead };
