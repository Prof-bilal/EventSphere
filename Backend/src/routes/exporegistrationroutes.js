const RegisterationController = require("../controller/expoRegistrationcontroller");
const express = require("express");
const router = express.Router();
const protectedRoute = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
router.get("/mine", protectedRoute, authorize("attendee"), require("../controller/Portalcontroller").getMyRegistrations);

router.post("/register/:expoId", protectedRoute, authorize("attendee"), RegisterationController.registerForExpo);
router.get("/register", protectedRoute, authorize("admin"), RegisterationController.getAllRegistration);
router.get("/register/:expoId", protectedRoute, authorize("attendee"), RegisterationController.getRegistrationById);
router.put("/register/:id", protectedRoute, authorize("attendee"), RegisterationController.cancelRegistration);
router.put("/register/attend/:id", protectedRoute, authorize("admin"), RegisterationController.markAttendance);
router.get("/register/attendeeCount/:expoId", protectedRoute, authorize("admin"), RegisterationController.attendeeCount);


module.exports = router;
