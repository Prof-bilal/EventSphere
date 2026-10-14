const User = require("../model/Usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const revokedTokenModel = require("../model/revokesession");
const { sendEmail, sendPasswordResetEmail } = require("../services/BrevoServices");
const { notifyUser } = require("../services/NotificationService");

const registerUser = async (req, res) => {

    try {
        const { name, email, password, phone, role } = req.body;

        const allowedRegistrationRoles = ["attendee", "exhibitor"];
        const selectedRole = role || "attendee";

        if (!allowedRegistrationRoles.includes(selectedRole)) {
            return res.status(400).json({
                message: "Public registration is only available for attendees and exhibitors",
            });
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).json({ message: "Please provide a valid password" });
        }

        const profileImage = req.file
            ? `/uploads/users/${req.file.filename}`
            : undefined;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const emailVerificationToken = crypto.randomBytes(32).toString("hex");

        const hashedEmailVerificationToken = crypto.createHash("sha256").update(emailVerificationToken).digest("hex");

        const emailVerificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;


        const approvalStatus = selectedRole === "exhibitor" ? "pending" : "approved";



        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            profileImage,
            role: selectedRole,
            approvalStatus,
            isEmailVerified: false,
            emailVerificationToken: hashedEmailVerificationToken,
            emailVerificationTokenExpires,
        });

        await sendEmail(newUser.email, "Verify Your Email", `
            <p>Hi ${newUser.name},</p>
            <p>Please click the link below to verify your email:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(newUser.email)}&token=${emailVerificationToken}">Verify Email</a>
        `);

        await newUser.save();
        if (selectedRole === "exhibitor") {
            res.status(201).json({ message: "User registered successfully. Your account is pending approval." });
        } else {
            res.status(201).json({ message: "User registered successfully. Please verify your email." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

const LoginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }

        if (user.IsBlocked || !user.IsActive) {
            return res.status(403).json({ message: "Your account is blocked or inactive" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);



        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (
            user.role === "exhibitor" &&
            user.approvalStatus === "pending"
        ) {
            return res.status(403).json({
                message: "Your account is pending approval. Please wait for admin approval."
            });
        }

        if (
            user.role === "exhibitor" &&
            user.approvalStatus === "rejected"
        ) {
            return res.status(403).json({
                message: "Your account has been rejected. Please contact support for more information."
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email first",
            });
        }


        const token = jwt.sign({ id: user._id, role: user.role, jti: crypto.randomUUID() }, process.env.JWT_SECRET, { expiresIn: "7d" });


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login Successful", user: { email: user.email, role: user.role }, token });

    }
    catch (error) {
        res.status(500).json({ message: "Error logging in user", error });
    }
}

const getPendingExhibitors = async (req, res) => {
    try {
        const exhibitors = await User.find({ role: "exhibitor", approvalStatus: "pending" }).select("-password -emailVerificationToken -passwordResetToken");
        return res.status(200).json(exhibitors);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const approveExhibitor = async (req, res) => {
    try {
        const exhibitor = await User.findOne({ _id: req.params.id, role: "exhibitor" });
        if (!exhibitor) {
            return res.status(404).json({ message: "Exhibitor not found" });
        }
        if (exhibitor.approvalStatus === "approved") {
            return res.status(400).json({ message: "Exhibitor is already approved" });
        }

        exhibitor.approvalStatus = "approved";
        await exhibitor.save();
        await notifyUser(req.app.get("io"), {
            userId: exhibitor._id,
            title: "Exhibitor account approved",
            message: "Your exhibitor account has been approved. You can now log in.",
            type: "account"
        });

        return res.status(200).json({ message: "Exhibitor approved successfully", exhibitor });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const rejectExhibitor = async (req, res) => {
    try {
        const exhibitor = await User.findOne({ _id: req.params.id, role: "exhibitor" });
        if (!exhibitor) {
            return res.status(404).json({ message: "Exhibitor not found" });
        }
        if (exhibitor.approvalStatus === "rejected") {
            return res.status(400).json({ message: "Exhibitor is already rejected" });
        }

        exhibitor.approvalStatus = "rejected";
        await exhibitor.save();
        await notifyUser(req.app.get("io"), {
            userId: exhibitor._id,
            title: "Exhibitor account rejected",
            message: req.body.reason || "Your exhibitor account has been rejected.",
            type: "account"
        });

        return res.status(200).json({ message: "Exhibitor rejected successfully", exhibitor });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -emailVerificationToken -passwordResetToken");
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const blockUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: "You cannot block your own account" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { IsBlocked: true, IsActive: false, UpdatedAt: Date.now() },
            { new: true }
        ).select("-password -emailVerificationToken -passwordResetToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User blocked successfully", user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const unblockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { IsBlocked: false, IsActive: true, UpdatedAt: Date.now() },
            { new: true }
        ).select("-password -emailVerificationToken -passwordResetToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User unblocked successfully", user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const LogoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await revokedTokenModel.create({ jti: decoded.jti, expiresAt: new Date(decoded.exp * 1000) });

        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });

        res.status(200).json({ message: "Logout Successful" });



    }
    catch (error) {
        res.status(500).json({ message: "Error logging out user", error });
    }
}

const Profile = async (req, res) => {
    try {
        const userId = req.user.id;



        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
}

const EditProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;

        const profileImage = req.file
            ? `/uploads/users/${req.file.filename}`
            : undefined;

        const updateData = { name, phone };

        if (profileImage) {
            updateData.profileImage = profileImage;
        }

        const update = await User.findByIdAndUpdate(userId, updateData, { UpdatedAt : Date.now(), returnDocument: "after", runValidators: true });
        if (!update) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile updated successfully", user: { name: update.name, phone: update.phone, profileImage: update.profileImage } });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
}

const VerifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.passwordResetToken = hashedResetToken;
        user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();
        try {
            await sendPasswordResetEmail(user.email, user.name, resetToken);
        }
        catch (emailError) {
            console.error("Error sending password reset email:", emailError);
            return res.status(500).json({ message: "Error sending password reset email" });
        }

        res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
    }
    catch (error) {
        res.status(500).json({ message: "Error processing password reset", error: error.message });
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters long",
            });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
}

module.exports = { registerUser, LoginUser, getPendingExhibitors, approveExhibitor, rejectExhibitor, getUsers, blockUser, unblockUser, LogoutUser, Profile, EditProfile, VerifyEmail, ForgotPassword, ResetPassword };
