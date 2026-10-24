require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./model/Usermodel");

const createAdmin = async () => {
    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;
        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGO_URI) throw new Error("Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD and MONGO_URI in Backend/.env first");
        if (ADMIN_PASSWORD.length < 8) throw new Error("Admin password must have at least 8 characters");
        await mongoose.connect(MONGO_URI);
        const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
        if (existing) throw new Error("This email already exists. No account was changed.");
        await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), password: await bcrypt.hash(ADMIN_PASSWORD, 10), role: "admin", isEmailVerified: true });
        console.log("Organizer account created. You can sign in now.");
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    } finally { await mongoose.disconnect(); }
};

createAdmin();
