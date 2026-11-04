require("dotenv").config();
const mongoose = require("mongoose");
const Expo = require("./model/expomodel");
const Booth = require("./model/boothmodel");
const Session = require("./model/Sessionmodel");
const User = require("./model/Usermodel");

const researchedExpos = [
    {
        title: "ITIF Asia 2026",
        description: "The 24th International Industrial Engineering Exhibition connecting engineering, manufacturing, automation, and industrial technology professionals.",
        theme: "Industrial innovation",
        startDate: "2026-11-04",
        endDate: "2026-11-06",
        registrationDeadline: "2026-11-03",
        capacity: 1200,
        location: "Expo Centre Lahore",
        imageUrl: "/assets/expos/itif-asia-2026.png",
    },
    {
        title: "Educational Arena 2026",
        description: "An education-focused expo bringing institutions, publishers, educators, and learning technology providers together.",
        theme: "Future of learning",
        startDate: "2026-11-13",
        endDate: "2026-11-15",
        registrationDeadline: "2026-11-12",
        capacity: 900,
        location: "Expo Centre Lahore",
        imageUrl: "/assets/expos/educational-arena-2026.png",
    },
    {
        title: "Pakistan Industrial Expo 2026",
        description: "A business and industrial showcase for manufacturers, suppliers, engineers, and buyers looking for new partnerships.",
        theme: "Industry and trade",
        startDate: "2026-11-14",
        endDate: "2026-11-16",
        registrationDeadline: "2026-11-13",
        capacity: 1500,
        location: "Expo Centre Lahore",
        imageUrl: "/assets/expos/pakistan-industrial-expo-2026.png",
    },
    {
        title: "Green Pakistan Expo",
        description: "A sustainability and green innovation exhibition featuring clean technology, responsible materials, and environmental solutions.",
        theme: "Sustainable future",
        startDate: "2026-11-26",
        endDate: "2026-11-28",
        registrationDeadline: "2026-11-25",
        capacity: 1000,
        location: "Expo Centre Lahore",
        imageUrl: "/assets/expos/green-pakistan-expo.png",
    },
    {
        title: "IAPEX Lahore 2026",
        description: "A professional platform for architects, designers, building material brands, and construction innovators.",
        theme: "Architecture and design",
        startDate: "2026-12-04",
        endDate: "2026-12-06",
        registrationDeadline: "2026-12-03",
        capacity: 1100,
        location: "Expo Centre Lahore",
        imageUrl: "/assets/expos/iapex-lahore-2026.png",
    },
    {
        title: "Health Asia 2026",
        description: "A medical, pharmaceutical, and laboratory technology exhibition for healthcare professionals and solution providers.",
        theme: "Healthcare technology",
        startDate: "2026-12-02",
        endDate: "2026-12-04",
        registrationDeadline: "2026-12-01",
        capacity: 1300,
        location: "Expo Centre Lahore",
        imageUrl: "/assets/expos/health-asia-2026.png",
    },
];

const floorNames = ["Main Hall", "Innovation Hall", "Energy Hall", "Trade Hall", "Community Hall"];
const boothContent = Array.from({ length: 30 }, (_, index) => {
    const floorIndex = Math.floor(index / 6);
    const column = index % 6;
    const premium = index % 5 === 0;
    return {
        boothNumber: `DEMO-${String(index + 1).padStart(2, "0")}`,
        boothType: premium ? "Premium" : "Standard",
        floorName: floorNames[floorIndex],
        x: 4 + column * 22,
        y: 5 + floorIndex * 22,
        width: premium ? 20 : 18,
        height: 14,
        price: premium ? 450 : 300,
        products: ["AI platforms", "Smart sensors", "Clean energy", "Industrial tools", "Startup services"][floorIndex],
        services: ["Product demos", "Technical workshops", "Energy assessments", "Business consultations", "Mentoring sessions"][floorIndex],
        staff: `${floorNames[floorIndex]} team`,
    };
});

const sessionTitles = [
    ["Responsible AI in Practice", "Trust and safety", "Ayesha Khan", "Main Stage"],
    ["From Data to Digital Twins", "Technology convergence", "Hamza Raza", "Innovation Theatre"],
    ["Designing a Sustainable Expo", "Industrial sustainability", "Sara Malik", "Main Stage"],
    ["Build a Secure AI Prototype", "Secure product design", "Omar Siddiqui", "Workshop Room"],
    ["Energy Aware Connected Systems", "Energy and materials", "Nadia Hussain", "Innovation Theatre"],
    ["Modern Manufacturing Networks", "Connected manufacturing", "Bilal Ahmed", "Hall A Forum"],
    ["Digital Skills for Growing Teams", "Workforce development", "Hira Shah", "Community Lounge"],
    ["Climate Data for Better Decisions", "Climate intelligence", "Usman Tariq", "Green Lab"],
    ["Building Better Customer Journeys", "Customer experience", "Maham Ali", "Trade Lounge"],
    ["Open Innovation Partnerships", "Research partnerships", "Farhan Iqbal", "Hall B Forum"],
    ["The Future of Smart Logistics", "Smart logistics", "Sana Khalid", "Main Stage"],
    ["Practical Cyber Hygiene", "Digital security", "Zain Abbas", "Workshop Room"],
    ["Circular Materials in Practice", "Circular economy", "Maryam Riaz", "Green Lab"],
    ["Funding the Next Big Idea", "Startup finance", "Usama Khan", "Community Lounge"],
    ["Designing for Digital Inclusion", "Inclusive technology", "Iqra Nadeem", "Innovation Theatre"],
    ["Sensors That Improve Operations", "Industrial sensing", "Danish Malik", "Hall A Forum"],
    ["From Prototype to Market", "Product strategy", "Rabia Noor", "Trade Lounge"],
    ["Responsible Data Governance", "Data governance", "Ali Hassan", "Hall B Forum"],
    ["Leading Change with Technology", "Change leadership", "Nimra Aslam", "Main Stage"],
    ["Closing Ideas and Next Steps", "Future collaboration", "Ahmed Rauf", "Main Stage"],
    ["Healthier Workplaces Through Design", "Workplace innovation", "Sadia Yousaf", "Hall C Forum"],
    ["Robotics on the Factory Floor", "Industrial robotics", "Waleed Arif", "Engineering Lab"],
    ["Marketing Beyond the Booth", "Brand storytelling", "Kiran Javed", "Trade Lounge"],
    ["Measuring Event Impact", "Impact measurement", "Faizan Noor", "Community Lounge"],
    ["Founder Connections Roundtable", "Entrepreneurship", "Amina Saeed", "Startup Zone"],
];

const sessionContent = sessionTitles.map(([title, topic, speakerName, location], index) => {
    const dayOffset = index % 3;
    const startHour = 9 + ((index * 2) % 8);
    const startTime = `${String(startHour).padStart(2, "0")}:00`;
    const endTime = `${String(startHour + 1).padStart(2, "0")}:00`;
    return {
        title,
        topic,
        speakerName,
        location,
        dayOffset,
        startTime,
        endTime,
        description: `A practical EventSphere session exploring ${topic.toLowerCase()} with examples, questions, and ideas attendees can take back to their teams.`,
        sessionType: index % 4 === 3 ? "workshop" : index % 3 === 0 ? "seminar" : "session",
        capacity: 40 + (index % 5) * 20,
        fee: 0,
    };
});

async function main() {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required in Backend/.env");
    await mongoose.connect(process.env.MONGO_URI);

    const organizer = await User.findOne({ role: "admin", IsActive: true });
    if (!organizer) throw new Error("Create an admin account before seeding expos");

    let exposCreated = 0;
    let exposUpdated = 0;
    for (const item of researchedExpos) {
        const existing = await Expo.findOne({ title: item.title });
        if (existing) {
            if (item.imageUrl && existing.imageUrl !== item.imageUrl) {
                existing.imageUrl = item.imageUrl;
                await existing.save();
                exposUpdated += 1;
            }
            continue;
        }
        await Expo.create({ ...item, organizerId: organizer._id, status: "published" });
        exposCreated += 1;
    }

    const expo = await Expo.findOne({ status: "published" }).sort({ startDate: 1 });
    if (!expo) throw new Error("Create and publish an expo before seeding demo content");

    let boothsCreated = 0;
    for (const item of boothContent) {
        const existing = await Booth.findOne({ expoId: expo._id, boothNumber: item.boothNumber });
        if (existing) continue;
        await Booth.create({
            boothNumber: item.boothNumber,
            expoId: expo._id,
            boothType: item.boothType,
            floorName: item.floorName,
            position: { x: item.x, y: item.y, width: item.width, height: item.height },
            size: { width: item.width, height: item.height },
            price: item.price,
            products: item.products,
            services: item.services,
            staff: item.staff,
        });
        boothsCreated += 1;
    }

    let sessionsCreated = 0;
    for (const item of sessionContent) {
        const existing = await Session.findOne({ expoId: expo._id, title: item.title });
        if (existing) continue;
        const sessionDate = new Date(expo.startDate);
        sessionDate.setDate(sessionDate.getDate() + item.dayOffset);
        await Session.create({ ...item, expoId: expo._id, startDate: sessionDate });
        sessionsCreated += 1;
    }

    console.log(`Seeded ${exposCreated} expos (${exposUpdated} updated), ${boothsCreated} booths, and ${sessionsCreated} sessions for ${expo.title}.`);
}

main()
    .catch((error) => {
        console.error(`Content seeding failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
