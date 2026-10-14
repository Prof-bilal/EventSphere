const Booth = require("../model/boothmodel");
const Expo = require("../model/expomodel");
const User = require("../model/Usermodel");
const { notifyUser } = require("../services/NotificationService");


const createBooth = async (req, res) => {
    try {
        const { boothType, floorName, position, size, price } = req.body;
        const expoId = req.params.expoId;

        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: "Expo not found" });
        }
        const boothCount = await Booth.countDocuments({ expoId });
        const boothNumber = `${expo.title}-${boothCount + 1}`;


        const booth = await Booth.create({
            expoId,
            boothType,
            boothNumber,
            floorName,
            position,
            size,
            price
        });
        return res.status(201).json({ message: "Booth created successfully", booth });

    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const assignBooth = async (req, res) => {
    try {
        const { id } = req.params;
        const { exhibitorId } = req.body;
        const booth = await Booth.findById(id);
        if (!booth) {
            return res.status(404).json({ message: "Booth not found" });
        }
        if (!exhibitorId) {
            return res.status(400).json({ message: "Please provide an exhibitor ID" });
        }
        if (booth.exhibitorId) {
            return res.status(400).json({ message: "Booth is already assigned to an exhibitor" });
        }
        const exhibitor = await User.findOne({ _id: exhibitorId, role: "exhibitor" });
        if (!exhibitor) {
            return res.status(404).json({ message: "Exhibitor not found" });
        }
        booth.exhibitorId = exhibitorId;
        booth.status = "booked";
        await booth.save();
        await notifyUser(req.app.get("io"), {
            userId: exhibitorId,
            title: "Booth assigned",
            message: `Booth ${booth.boothNumber} has been assigned to you.`,
            type: "booth",
            relatedExpoId: booth.expoId
        });
        return res.status(200).json({ message: "Booth assigned successfully", booth });
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}   

const getBooths = async (req,res) => {
    try {
        const booths = await Booth.find().populate("exhibitorId", "name").populate("expoId", "title");
        return res.status(200).json(booths);
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getBoothById = async (req , res) => {
    try {
        const { id } = req.params;
        const booth = await Booth.findById(id).populate("exhibitorId", "name").populate("expoId", "title");
        if(!booth){
            return res.status(404).json({ message: "Booth not found" });
        }
        return res.status(200).json(booth);
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getBoothsByUser = async (req , res) => {
    try {
        const exhibitorId = req.user.id;
        const booths = await Booth.find({ exhibitorId });
        if (!booths) {
            return res.status(404).json({ message: "Booth not found" });
        }
        return res.status(200).json(booths);
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const EditBooth = async (req , res) => {
    try {
        const { id } = req.params;
        const {boothType , floorName , position , size , price , status } = req.body;
        const booth = await Booth.findById(id);
        if(!booth){
            return res.status(404).json({ message: "Booth not found" });
        }
        const getExpo = await Expo.findById(booth.expoId);
        if (!getExpo) {
            return res.status(404).json({ message: "Expo not found" });
        }
        if(getExpo.startDate){
            const currenttime = Date.now();
            const realdate = new Date(getExpo.startDate).getTime();
            const twodayinms = 24 * 60 * 60 * 1000;

            if (realdate - currenttime <= twodayinms) {
                return res.status(400).json({message : "You cannot update the booth with in 2 days of the expo date"})
            }
        }

        
        const updatedBooth = await Booth.findByIdAndUpdate(id, { boothType , floorName , position , size , price , status, updatedAt: Date.now() } , { returnDocument : "after" , runValidators:true});
        return res.status(200).json({ message: "Booth Updated successfully", booth:updatedBooth });
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const DeleteBooth = async (req , res) => {
    try {
        const { id } = req.params;
        const booth = await Booth.findById(id);
        if(!booth){
            return res.status(404).json({ message: "Booth not found" });
        }
          const getExpo = await Expo.findById(booth.expoId);
        if (!getExpo) {
            return res.status(404).json({ message: "Expo not found" });
        }
          
        if(getExpo.startDate){
            const currenttime = Date.now();
            const realdate = new Date(getExpo.startDate).getTime();
            const twodayinms = 24 * 60 * 60 * 1000;

            if (realdate - currenttime <= twodayinms) {
                return res.status(400).json({message : "You cannot delete the booth with in 2 days of the expo date"})
            }
        }

        if(booth.exhibitorId != null) {
            return res.status(400).json({message : "You cannot delete the booth which is assigned to an exhibitor"})
        }
        
        await Booth.findByIdAndDelete(id);
        return res.status(200).json({ message: "Booth deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { createBooth , assignBooth , getBooths , getBoothById , getBoothsByUser , EditBooth , DeleteBooth}
