const Boothcontroller = require("../controller/Boothcontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();
const BoothRequest = require("../controller/BoothRequestcontroller");

router.get("/public", Boothcontroller.getBooths);
router.post("/:id/request", authMiddleware, authorize("exhibitor"), BoothRequest.requestBooth);
router.put("/:id/details", authMiddleware, authorize("exhibitor"), BoothRequest.updateDetails);
router.post("/:id/visit", authMiddleware, authorize("attendee"), BoothRequest.visitBooth);

router.post("/create/:expoId" , authMiddleware, authorize("admin"), Boothcontroller.createBooth);
router.put("/assign/:id" , authMiddleware, authorize("admin"), Boothcontroller.assignBooth);
router.get("/getBooth", authMiddleware, authorize("admin", "exhibitor", "attendee"), Boothcontroller.getBooths);
router.put("/updateBooth/:id" , authMiddleware, authorize("admin"), Boothcontroller.EditBooth);
router.delete("/deleteBooth/:id" , authMiddleware, authorize("admin"), Boothcontroller.DeleteBooth);
router.get("/getBooth/:id", authMiddleware, authorize("admin", "exhibitor"), Boothcontroller.getBoothById);
router.get("/getMyBooths", authMiddleware, authorize("exhibitor"), Boothcontroller.getBoothsByUser);


module.exports = router;
