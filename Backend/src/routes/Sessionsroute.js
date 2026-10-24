const SessionController = require("../controller/Sessioncontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();
const SessionRegistration = require("../controller/SessionRegistrationcontroller");

router.get("/my-registrations", authMiddleware, authorize("attendee"), SessionRegistration.getMySessions);
router.post("/:id/register", authMiddleware, authorize("attendee"), SessionRegistration.registerSession);
router.delete("/:id/register", authMiddleware, authorize("attendee"), SessionRegistration.cancelSession);
router.post("/create-session/:expoId", authMiddleware, authorize("admin"), SessionController.CreateSession);

router.post("/create-session/:expoId/:boothId/:exhibitorId", authMiddleware, authorize("exhibitor", "admin"),SessionController.CreateSession);
router.post("/create-session/:expoId/:boothId", authMiddleware, authorize("exhibitor", "admin"),SessionController.CreateSession);
router.get("/get-sessions" , SessionController.getSessions);
router.get("/get-sessions/:expoId" , authMiddleware, authorize("admin", "exhibitor", "attendee"), SessionController.getSessionsByExpo);
router.get("/get-session/:id" , SessionController.getSessionById);
router.put("/update-session/:id" , authMiddleware, authorize("exhibitor", "admin"),SessionController.updateSession);
router.delete("/delete-session/:id" , authMiddleware, authorize("exhibitor", "admin"),SessionController.deleteSession);

module.exports = router;
