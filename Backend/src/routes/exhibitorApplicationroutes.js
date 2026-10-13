const ExhibitorApplicationcontroller = require('../controller/ExhibitorApplicationcontroller');
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const {forFolder} = require("../middleware/upload");
const applicationupload = forFolder("applications")

const router = express.Router();


router.post("/create/:expoId", authMiddleware, authorize("exhibitor", "admin"), applicationupload.fields([{name:"documents", maxCount:10}]), ExhibitorApplicationcontroller.CreateApplication);
router.get("/getApplications" , authMiddleware , authorize("admin" ),ExhibitorApplicationcontroller.getApplications);
router.get("/getApplication/:id" , authMiddleware , authorize("exhibitor" , "admin") , ExhibitorApplicationcontroller.getApplicationById)



module.exports = router;
