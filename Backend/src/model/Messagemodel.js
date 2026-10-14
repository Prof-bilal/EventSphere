const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expo",
        default: null
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 2000
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
