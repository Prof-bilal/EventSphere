const FeedbackController = require("../controller/Feedbackcontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();
router.get("/mine", authMiddleware, require("../controller/Portalcontroller").getMyFeedback);

router.post("/", authMiddleware, authorize("admin", "exhibitor", "attendee"), FeedbackController.createFeedback);
router.get("/", authMiddleware, authorize("admin"), FeedbackController.getFeedback);
router.put("/:id/status", authMiddleware, authorize("admin"), FeedbackController.updateFeedbackStatus);

module.exports = router;

