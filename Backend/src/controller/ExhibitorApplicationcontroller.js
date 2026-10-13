const ExhibitorApplication = require("../model/exhibitorApplicationmodel");

const CreateApplication = async (req, res) => {
    try {
        const { ApplicationStatus } = req.body;
        const files = req.files?.documents || [];
        if (files.length === 0) {
            return res.status(400).json({ message: "Documents are required" });
        }

        const submittedDocuments = files.map(file => `/uploads/applications/${file.filename}`);
        const expoId = req.params.expoId;
        if (!expoId) {
            return res.status(400).json({ message: "Expo not found" });
        }
        const exhibitorId = req.user.id;
        if (!exhibitorId) {
            return res.status(400).json({ message: "Exhibitor not found" });
        }
        const existingApplication = await ExhibitorApplication.findOne({
            expoId,
            exhibitorId
        })
        if (existingApplication) {
            return res.status(400).json({ message: "Application already exists" });
        }
        const application = await ExhibitorApplication.create({
            expoId,
            exhibitorId,
            ApplicationStatus,
            submittedDocuments
        })

        res.status(201).json({ message: "Application created successfully", application });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getApplications = async (req , res) => {
    try {
        const getApplications = await ExhibitorApplication.find({
            
        }).populate("expoId", "title").populate("exhibitorId", "name");
        res.status(200).json({ message: "Applications fetched successfully", getApplications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getApplicationById = async (req , res) => {
    try {
        const {id} = req.params;

      
        const existingAppication = await ExhibitorApplication.findById(id)  .populate("expoId", "title")
            .populate("exhibitorId", "name email");

        if(!existingAppication) {
            return res.status(404).json({message : "Application not found"})
        }

        return res.status(200).json(existingAppication)

    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}



module.exports = {
    CreateApplication ,
    getApplications ,
    getApplicationById
}
