const exhibitorController = require("../controller/ExhibitorProfilecontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const autharize = require("./../middleware/rolemiddleware");
const {forFolder} = require("./../middleware/upload");
const exhibitoroupload = forFolder("exhibitor")
const router = express.Router();

router.post("/createProfile" , authMiddleware , autharize("admin" , "exhibitor") , exhibitoroupload.single("image") , exhibitorController.CreateExhibitor);
router.get("/getexhibitor" , authMiddleware , autharize("admin") , exhibitorController.getExhibitor);
router.put("/updateexhibitor/:id" , authMiddleware , autharize("exhibitor" ) , exhibitoroupload.single("image") , exhibitorController.editExhibitor);
router.delete("/deleteexhibitor/:id" , authMiddleware , autharize("admin" , "exhibitor") , exhibitorController.deleteExhibitor)


module.exports = router;