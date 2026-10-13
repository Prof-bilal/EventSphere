const Boothcontroller = require("../controller/Boothcontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();

router.post("/create/:expoId" , authMiddleware, authorize("admin"), Boothcontroller.createBooth);
router.put("/assign/:id" , authMiddleware, authorize("admin"), Boothcontroller.assignBooth);
router.get("/getBooth", authMiddleware, authorize("admin", "exhibitor"), Boothcontroller.getBooths);
router.put("/updateBooth/:id" , authMiddleware, authorize("admin"), Boothcontroller.EditBooth);
router.delete("/deleteBooth/:id" , authMiddleware, authorize("admin"), Boothcontroller.DeleteBooth);
router.get("/getBooth/:id", authMiddleware, authorize("admin", "exhibitor"), Boothcontroller.getBoothById);
router.get("/getMyBooths", authMiddleware, authorize("exhibitor"), Boothcontroller.getBoothsByUser);


module.exports = router;