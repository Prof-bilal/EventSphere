const UserController = require("./../controller/Usercontroller");
const authMiddleware = require("./../middleware/authmiddleware");
const upload = require("./../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/register" ,upload.single("profilePicture"), UserController.registerUser);
router.post("/login" , UserController.LoginUser);
router.post("/logout" , UserController.LogoutUser);
router.get("/profile" , authMiddleware, UserController.Profile);
router.put("/editprofile" , upload.single("profilePicture"), authMiddleware, UserController.EditProfile);
router.get("/verify-email" , UserController.VerifyEmail);
router.post("/forgot-password", UserController.ForgotPassword);
router.post("/reset-password", UserController.ResetPassword);

module.exports = router;