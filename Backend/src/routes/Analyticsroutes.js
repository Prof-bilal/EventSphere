const AnalyticsController = require("../controller/Analyticscontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.get("/:expoId", authMiddleware, authorize("admin"), AnalyticsController.getAnalytics);

module.exports = router;

