const UserController = require("./../controller/Usercontroller");
const authMiddleware = require("./../middleware/authmiddleware");
const {forFolder} = require("./../middleware/upload");
const authorize = require("./../middleware/rolemiddleware");
const userUpload = forFolder("users");
const express = require("express");
const router = express.Router();
router.post("/resend-verification", require("../controller/Verificationcontroller").resendEmail);

router.post("/register" ,userUpload.single("profilePicture"), UserController.registerUser);
router.post("/login" , UserController.LoginUser);
router.get("/pending-exhibitors", authMiddleware, authorize("admin"), UserController.getPendingExhibitors);
router.put("/approve-exhibitor/:id", authMiddleware, authorize("admin"), UserController.approveExhibitor);
router.put("/reject-exhibitor/:id", authMiddleware, authorize("admin"), UserController.rejectExhibitor);
router.get("/users", authMiddleware, authorize("admin"), UserController.getUsers);
router.put("/block-user/:id", authMiddleware, authorize("admin"), UserController.blockUser);
router.put("/unblock-user/:id", authMiddleware, authorize("admin"), UserController.unblockUser);
router.post("/logout" , UserController.LogoutUser);
router.get("/profile" , authMiddleware, UserController.Profile);
router.put("/editprofile" , authMiddleware, userUpload.single("profilePicture"), UserController.EditProfile);
router.get("/verify-email" , UserController.VerifyEmail);
router.post("/forgot-password", UserController.ForgotPassword);
router.post("/reset-password", UserController.ResetPassword);

module.exports = router;
