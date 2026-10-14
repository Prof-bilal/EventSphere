const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,  "Name is required" ],
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [30, "Name cannot exceed 30 characters"],
        match: /^[a-zA-Z]+$/
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [90, "Password cannot exceed 90 characters"],
        match : ["^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$" , "Please provide a valid password" ]
    },
    phone: {
        type: String,
        minlength: [10, "Phone number must be at least 10 digits long"],
        maxlength: [15, "Phone number cannot exceed 15 digits"],
        match: /^[0-9]+$/
    },
    profileImage: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpires: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },

    passwordResetExpires: {
        type: Date,
    },
    IsBlocked: {
        type: Boolean,
        default: false
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    IsActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ["admin", "exhibitor", "attendee"],
        default: "attendee"
    },
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved"
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    }


})

const User = mongoose.model("User", userSchema)
module.exports = User;
