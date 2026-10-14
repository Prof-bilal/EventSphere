const Message = require("../model/Messagemodel");
const User = require("../model/Usermodel");
const { notifyUser } = require("../services/NotificationService");

const sendMessage = async (req, res) => {
    try {
        const { receiverId, expoId, message } = req.body;
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        const newMessage = await Message.create({ senderId: req.user.id, receiverId, expoId, message });
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
