const exhibitorController = require("../controller/ExhibitorProfilecontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const autharize = require("./../middleware/rolemiddleware");
const {forFolder} = require("./../middleware/upload");
const exhibitoroupload = forFolder("exhibitor")
const router = express.Router();
router.get("/my-profile", authMiddleware, autharize("exhibitor"), require("../controller/Portalcontroller").getMyProfile);

router.post("/createProfile" , authMiddleware , autharize("exhibitor") , exhibitoroupload.fields([{ name: "image", maxCount: 1 }, { name: "documents", maxCount: 10 }]) , exhibitorController.CreateExhibitor);
router.get("/getexhibitor" , authMiddleware , autharize("admin" ) , exhibitorController.getExhibitor);
router.get("/search" , exhibitorController.searchExhibitor);
router.put("/updateexhibitor/:id" , authMiddleware , autharize("exhibitor" ) , exhibitoroupload.fields([{ name: "image", maxCount: 1 }, { name: "documents", maxCount: 10 }]) , exhibitorController.editExhibitor);
router.delete("/deleteexhibitor/:id" , authMiddleware , autharize("admin" , "exhibitor") , exhibitorController.deleteExhibitor)


module.exports = router;
