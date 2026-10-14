const Sessions = require("../model/Sessionmodel");
const Expo = require("../model/expomodel");
const Booth = require("../model/boothmodel");
const User = require("../model/Usermodel")
const Registration = require("../model/expoRegistrationsmodel");
const CreateSession = async (req , res) => {
    try {
        const {title , startDate , startTime , endTime , speakerName , topic , description , sessionType , capacity , fee} = req.body;
        const expoId = req.params.expoId;
        const boothId = req.params.boothId;
        const exhibitorId = req.params.exhibitorId;

        const expo = await Expo.findById(expoId);
        if(!expo){
            return res.status(404).json({message : "Expo Not Found"});
        }
        const booth = await Booth.findById(boothId);
        if(!booth){
            return res.status(404).json({message : "Booth Not Found"});
        }
        if(exhibitorId){
            const exhibitor = await User.findById(exhibitorId);
            if(!exhibitor){
                return res.status(404).json({message : "Exhibitor Not Found"});
            }
        }
        const session = new Sessions({
            title,
            expoId,
            exhibitorId,
            boothId,
            startDate,
            startTime,
            endTime,
            speakerName,
            topic,
            description,
            sessionType,
            capacity,
            fee
        })
        const savedSession = await session.save();
        res.status(201).json(savedSession);
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
}

const getSessions = async (req , res) => {
    try {
        const sessions = await Sessions.find();
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
        const {title , startDate , startTime , endTime , speakerName , topic , description , sessionType , capacity , fee} = req.body;
        const session = await Sessions.findById(id);
        if(!session){
            return res.status(404).json({message : "Session Not Found"});
        }
        const updatedSession = await Sessions.findByIdAndUpdate(id, {title , startDate , startTime , endTime , speakerName , topic , description , sessionType , capacity , fee , updatedAt : Date.now()} , {new : true , runValidators : true});
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
        await Sessions.findByIdAndDelete(id);
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
