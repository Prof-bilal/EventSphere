const Message = require("../model/Messagemodel");
const User = require("../model/Usermodel");
const { notifyUser } = require("../services/NotificationService");
const mongoose = require("mongoose");

const sendMessage = async (req, res) => {
    try {
        const { receiverId, expoId, message } = req.body;
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "A valid receiver is required" });
        }
        if (receiverId.toString() === req.user.id.toString()) {
            return res.status(400).json({ message: "You cannot message yourself" });
        }
        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        const newMessage = await Message.create({ senderId: req.user.id, receiverId, expoId, message: message.trim() });
        await notifyUser(req.app.get("io"), {
            userId: receiverId,
            title: "New message",
            message: "You received a new message in EventSphere.",
            type: "message",
            relatedExpoId: expoId
        });
        return res.status(201).json({ message: "Message sent successfully", data: newMessage });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(400).json({ message: "A valid contact is required" });
        }
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });
        await Message.updateMany({ senderId: otherUserId, receiverId: userId }, { isRead: true });
        return res.status(200).json(messages);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { sendMessage, getConversation };
