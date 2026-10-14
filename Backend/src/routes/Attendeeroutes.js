const AttendeeController = require("../controller/Attendeecontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.get("/dashboard", authMiddleware, authorize("attendee"), AttendeeController.getDashboard);

module.exports = router;

