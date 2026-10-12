const ExpoController = require("../controller/Expocontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const autharize = require("../middleware/rolemiddleware")
const {forFolder} = require("./../middleware/upload");
const expoupload = forFolder("expo")
const router = express.Router();


router.post("/createExpo" , authMiddleware ,expoupload.single("image"),autharize("admin"), ExpoController.createExpo)
router.get("/getExpo" , authMiddleware , autharize("admin") , ExpoController.getExpo)
router.put("/updateExpo/:id" , authMiddleware, autharize("admin") , expoupload.single("image") , ExpoController.updateExpo)
router.delete("/deleteExpo/:id" , authMiddleware , autharize("admin") , ExpoController.deleteExpo)

module.exports = router