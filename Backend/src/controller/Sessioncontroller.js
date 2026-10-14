const Sessions = require("../model/Sessionmodel");
const Expo = require("../model/expomodel");
const Booth = require("../model/boothmodel");

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


module.exports = {
    CreateSession
}