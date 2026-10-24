const Bookmark = require("../model/Bookmarkmodel");
const Sessions = require("../model/Sessionmodel");

const createBookmark = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const attendeeId = req.user.id;
        const session = await Sessions.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        const bookmark = await Bookmark.create({ attendeeId, sessionId });
        req.app.get("io")?.emit("event:updated", { expoId: session.expoId });
        return res.status(201).json({ message: "Session bookmarked successfully", bookmark });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Session already bookmarked" });
        }
        return res.status(500).json({ error: error.message });
    }
}

const getBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ attendeeId: req.user.id }).populate("sessionId");
        return res.status(200).json(bookmarks);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteBookmark = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const bookmark = await Bookmark.findOneAndDelete({ attendeeId: req.user.id, sessionId });
        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }
        return res.status(200).json({ message: "Bookmark deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { createBookmark, getBookmarks, deleteBookmark };
