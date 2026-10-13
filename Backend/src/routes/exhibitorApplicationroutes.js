const ExhibitorApplicationcontroller = require('../controller/ExhibitorApplicationcontroller');
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const {forFolder} = require("../middleware/upload");
const applicationupload = forFolder("applications")

const router = express.Router();


router.post("/create/:expoId", authMiddleware, authorize("exhibitor"), applicationupload.fields([{name:"documents", maxCount:10}]), ExhibitorApplicationcontroller.CreateApplication);
router.get("/getApplications" , authMiddleware , authorize("admin" ),ExhibitorApplicationcontroller.getApplications);
router.get("/getApplication/:id" , authMiddleware , authorize("exhibitor") , ExhibitorApplicationcontroller.getApplicationById)
router.put("/updateApplication/:id" , authMiddleware , authorize("exhibitor" ) , applicationupload.fields([{name:"documents", maxCount:10}]) , ExhibitorApplicationcontroller.UpdateApplication);
router.put("/approveApplication/:id" , authMiddleware , authorize("admin" ) , ExhibitorApplicationcontroller.ApproveApplication);
router.put("/rejectApplication/:id" , authMiddleware , authorize("admin" ) , ExhibitorApplicationcontroller.rejectApplication);
router.get("/getMyApplications" , authMiddleware , authorize("exhibitor" ) , ExhibitorApplicationcontroller.getMyApplications);


module.exports = router;
