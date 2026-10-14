const NotificationController = require("../controller/Notificationcontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.post("/", authMiddleware, authorize("admin"), NotificationController.createNotification);
router.get("/", authMiddleware, NotificationController.getNotifications);
router.put("/:id/read", authMiddleware, NotificationController.markNotificationRead);

module.exports = router;

