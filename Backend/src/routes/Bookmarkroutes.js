const BookmarkController = require("../controller/Bookmarkcontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.post("/:sessionId", authMiddleware, authorize("attendee"), BookmarkController.createBookmark);
router.get("/", authMiddleware, authorize("attendee"), BookmarkController.getBookmarks);
router.delete("/:sessionId", authMiddleware, authorize("attendee"), BookmarkController.deleteBookmark);

module.exports = router;

