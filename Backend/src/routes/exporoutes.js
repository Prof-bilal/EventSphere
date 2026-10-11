const ExpoController = require("../controller/Expocontroller");
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const router = express.Router();


router.post("createExpo" , authMiddleware , ExpoController.createExpo)

module.exports = router