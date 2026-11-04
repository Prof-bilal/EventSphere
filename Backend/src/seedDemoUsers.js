require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./model/Usermodel");
const Exhibitor = require("./model/exhibitorProfilemodel");

const required = [
    "DEMO_ATTENDEE_NAME",
    "DEMO_ATTENDEE_EMAIL",
    "DEMO_ATTENDEE_PASSWORD",
    "DEMO_EXHIBITOR_NAME",
    "DEMO_EXHIBITOR_EMAIL",
    "DEMO_EXHIBITOR_PASSWORD",
];

async function createUser({ name, email, password, role }) {
    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return { user: existing, created: false };

    const user = await User.create({
        name,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        role,
        approvalStatus: "approved",
        isEmailVerified: true,
    });
    return { user, created: true };
}

async function main() {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required in Backend/.env");
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Set these variables in Backend/.env: ${missing.join(", ")}`);

    await mongoose.connect(process.env.MONGO_URI);
    const attendee = await createUser({
        name: process.env.DEMO_ATTENDEE_NAME,
        email: process.env.DEMO_ATTENDEE_EMAIL,
        password: process.env.DEMO_ATTENDEE_PASSWORD,
        role: "attendee",
    });
    const exhibitor = await createUser({
        name: process.env.DEMO_EXHIBITOR_NAME,
        email: process.env.DEMO_EXHIBITOR_EMAIL,
        password: process.env.DEMO_EXHIBITOR_PASSWORD,
        role: "exhibitor",
    });

    await Exhibitor.updateOne(
        { UserId: exhibitor.user._id },
        {
            $setOnInsert: {
                CompanyName: process.env.DEMO_COMPANY_NAME || "EventSphere Demo Company",
                description: "Demo exhibitor profile for assignment evaluation.",
                products: "Demo products",
                services: "Demo services",
                category: "Technology",
                contactPerson: exhibitor.user.name,
                phone: "03001234567",
                UserId: exhibitor.user._id,
            },
        },
        { upsert: true },
    );

    console.log(`Attendee ${attendee.created ? "created" : "already exists"}: ${process.env.DEMO_ATTENDEE_EMAIL}`);
    console.log(`Exhibitor ${exhibitor.created ? "created" : "already exists"}: ${process.env.DEMO_EXHIBITOR_EMAIL}`);
    console.log("Both demo accounts are email-verified and approved for local evaluation.");
}

main()
    .catch((error) => {
        console.error(`Demo user seeding failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
