const mongoose = require("mongoose");

const connectDB = async () =>{
    try {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        throw new Error("MongoDB connection failed. Check MONGO_URI in Backend/.env.");
    }
}

module.exports = connectDB;
