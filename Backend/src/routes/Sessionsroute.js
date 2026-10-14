const SessionController = require("../controller/Sessioncontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.post("/create-session/:expoId/:boothId/:exhibitorId", authMiddleware, authorize("exhibitor", "admin"),SessionController.CreateSession);

module.exports = router;