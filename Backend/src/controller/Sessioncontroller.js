const Sessions = require("../model/Sessionmodel");
const Expo = require("../model/expomodel");
const Booth = require("../model/boothmodel");
const User = require("../model/Usermodel")
const Registration = require("../model/expoRegistrationsmodel");
const { notifyUser } = require("../services/NotificationService");
const CreateSession = async (req , res) => {
    try {
        const {title , startDate , startTime , endTime , speakerName , topic , description , sessionType , capacity , fee, location} = req.body;
        const expoId = req.params.expoId;
        const boothId = req.params.boothId;
        const requestedExhibitorId = req.params.exhibitorId;
        let exhibitorId = null;

        const expo = await Expo.findById(expoId);
        if(!expo){
            return res.status(404).json({message : "Expo Not Found"});
        }
        if (startTime >= endTime) return res.status(400).json({ message: "End time must be after start time" });
        if (new Date(startDate) < new Date(expo.startDate) || new Date(startDate) > new Date(expo.endDate)) {
            return res.status(400).json({ message: "Session date must be within the expo dates" });
        }
        const conflict = await Sessions.findOne({ expoId, startDate, location, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
        if (conflict) return res.status(400).json({ message: "Another session uses this location at that time" });
        const booth = boothId ? await Booth.findById(boothId) : null;
        if(boothId && !booth){
            return res.status(404).json({message : "Booth Not Found"});
        }
        if (booth && booth.expoId.toString() !== expoId) {
            return res.status(400).json({ message: "Booth does not belong to this expo" });
        }
        if (req.user.role === "exhibitor") {
            exhibitorId = req.user.id;
            if (requestedExhibitorId && requestedExhibitorId !== exhibitorId) {
                return res.status(403).json({ message: "You can only create sessions for yourself" });
            }
            if (!booth || !booth.exhibitorId || booth.exhibitorId.toString() !== exhibitorId) {
                return res.status(403).json({ message: "You can only create a session for your assigned booth" });
            }
        }
        else if (requestedExhibitorId) {
            exhibitorId = requestedExhibitorId;
        }
        if(exhibitorId){
            const exhibitor = await User.findOne({ _id: exhibitorId, role: "exhibitor" });
            if(!exhibitor){
                return res.status(404).json({message : "Exhibitor Not Found"});
            }
            if (!booth || !booth.exhibitorId || booth.exhibitorId.toString() !== exhibitorId) {
                return res.status(400).json({ message: "Booth is not assigned to this exhibitor" });
            }
        }
        const session = new Sessions({
            title,
            expoId,
            exhibitorId,
            boothId: boothId || undefined,
            startDate,
            startTime,
            endTime,
            speakerName,
            topic,
            description,
            sessionType,
            capacity,
            fee,
            location
        })
        const savedSession = await session.save();
        req.app.get("io")?.emit("event:updated", { expoId });
        const registrations = await Registration.find({ expoId, status: "registered" }).select("attendeeId");
        await Promise.all(registrations.map((registration) => notifyUser(req.app.get("io"), {
            userId: registration.attendeeId,
            title: "New session available",
            message: `${savedSession.title} is now available in your Expo schedule.`,
            type: "session",
            relatedExpoId: expoId
        })));
        res.status(201).json(savedSession);
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
}

const getSessions = async (req , res) => {
    try {
        const filter = req.query.expoId ? { expoId: req.query.expoId } : {};
        const sessions = await Sessions.find(filter).populate("expoId", "title");
        if(!sessions){
            return res.status(404).json({message : "Sessions Not Found"});
        }
        res.status(200).json(sessions);
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
}

const getSessionsByExpo = async (req , res) => {
    try {
        const { expoId } = req.params;
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: "Expo Not Found" });
        }

        if (req.user.role === "attendee") {
            const registration = await Registration.findOne({
                expoId,
                attendeeId: req.user.id,
                status: "registered"
            });

            if (!registration) {
                return res.status(403).json({ message: "Please register for this expo first" });
            }
        }

        const sessions = await Sessions.find({ expoId });
        return res.status(200).json(sessions);
    }
    catch (error) {
        return res.status(500).json({message : error.message});
    }
}

const getSessionById = async (req , res) => {
    try {
        const {id} = req.params;
        const session = await Sessions.findById(id);
        if(!session){
            return res.status(404).json({message : "Session Not Found"});
        }
        res.status(200).json(session);
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
}

const updateSession = async (req , res) => {
    try {
        const {id} = req.params;
        const {title , startDate , startTime , endTime , speakerName , topic , description , sessionType , capacity , fee, location} = req.body;
        const session = await Sessions.findById(id);
        if(!session){
            return res.status(404).json({message : "Session Not Found"});
        }
        if (req.user.role === "exhibitor" && (!session.exhibitorId || session.exhibitorId.toString() !== req.user.id)) {
            return res.status(403).json({ message: "You can only update your own sessions" });
        }
        if (startTime >= endTime) return res.status(400).json({ message: "End time must be after start time" });
        const expo = await Expo.findById(session.expoId);
        if (new Date(startDate) < new Date(expo.startDate) || new Date(startDate) > new Date(expo.endDate)) return res.status(400).json({ message: "Session date must be within expo dates" });
        const conflict = await Sessions.findOne({ _id: { $ne: id }, expoId: session.expoId, startDate, location, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
        if (conflict) return res.status(400).json({ message: "Another session uses this location at that time" });
        const updatedSession = await Sessions.findByIdAndUpdate(id, {title , startDate , startTime , endTime , speakerName , topic , description , sessionType , capacity , fee, location, updatedAt : Date.now()} , {new : true , runValidators : true});
        const registrations = await Registration.find({ expoId: session.expoId, status: "registered" });
        await Promise.all(registrations.map(item => notifyUser(req.app.get("io"), {
            userId: item.attendeeId, title: "Schedule updated", message: `${updatedSession.title} has been updated. Check the latest schedule.`, type: "session", relatedExpoId: session.expoId, email: false
        })));
        req.app.get("io")?.emit("event:updated", { expoId: session.expoId });
        res.status(200).json(updatedSession);
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
}

const deleteSession = async (req , res) => {
    try {
        const {id} = req.params;
        const session = await Sessions.findById(id);
        if(!session){
            return res.status(404).json({message : "Session Not Found"});
        }
        if (req.user.role === "exhibitor" && (!session.exhibitorId || session.exhibitorId.toString() !== req.user.id)) {
            return res.status(403).json({ message: "You can only delete your own sessions" });
        }
        await Sessions.findByIdAndDelete(id);
        await require("../model/SessionRegistrationmodel").deleteMany({ sessionId: id });
        await require("../model/Bookmarkmodel").deleteMany({ sessionId: id });
        req.app.get("io")?.emit("event:updated", { expoId: session.expoId });
        res.status(200).json({message : "Session Deleted Successfully"});
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
}

module.exports = {
    CreateSession , 
    getSessions ,
    getSessionsByExpo ,
    getSessionById ,
    updateSession ,
    deleteSession
}
