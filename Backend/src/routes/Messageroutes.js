const MessageController = require("../controller/Messagecontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.post("/", authMiddleware, authorize("admin", "exhibitor", "attendee"), MessageController.sendMessage);
router.get("/conversation/:userId", authMiddleware, authorize("admin", "exhibitor", "attendee"), MessageController.getConversation);

module.exports = router;

