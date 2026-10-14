const ExhibitorApplication = require("../model/exhibitorApplicationmodel");
const { notifyUser } = require("../services/NotificationService");

const CreateApplication = async (req, res) => {
    try {
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
            ApplicationStatus: "Applied",
            submittedDocuments
        })

        res.status(201).json({ message: "Application created successfully", application });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getApplications = async (req, res) => {
    try {
        const getApplications = await ExhibitorApplication.find({

        }).populate("expoId", "title").populate("exhibitorId", "name");
        res.status(200).json({ message: "Applications fetched successfully", getApplications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;


        const existingAppication = await ExhibitorApplication.findById(id).populate("expoId", "title")
            .populate("exhibitorId", "name email");

        if (!existingAppication) {
            return res.status(404).json({ message: "Application not found" })
        }
        if (req.user.role !== "admin" && existingAppication.exhibitorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only view your own application" });
        }

        return res.status(200).json(existingAppication)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const UpdateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { ApplicationStatus } = req.body;
        const files = req.files?.documents || [];
        const application = await ExhibitorApplication.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (req.user.role !== "admin" && application.exhibitorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own application" });
        }
        const submittedDocuments = application.submittedDocuments;
        const updateFields = {
            ApplicationStatus,
            updatedAt: Date.now()
        }

        if (files.length > 0) {
            updateFields.submittedDocuments = [...submittedDocuments, ...files.map(file => `/uploads/applications/${file.filename}`)];
        }
        const updatedApplication = await ExhibitorApplication.findByIdAndUpdate(id, updateFields, {
            updatedAt : Date.now(),
            returnDocument: "after",
            runValidators: true
        });

        if (!updatedApplication) {
            return res.status(404).json({ message: "Application not found" })
        }
        return res.status(200).json({ message: "Application updated successfully", updatedApplication });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const ApproveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await ExhibitorApplication.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }
        if(application.ApplicationStatus === "Approved" || application.ApplicationStatus === "Rejected") {
            return res.status(400).json({message : "Application is already approved or rejected"})
        }
        application.ApplicationStatus = "Approved";
        application.reviewedBy = req.user.id;
        application.remarks = req.body.remarks || application.remarks;
        application.reviewedAt = Date.now();
        await application.save();
        await notifyUser(req.app.get("io"), {
            userId: application.exhibitorId,
            title: "Exhibitor application approved",
            message: "Your exhibitor application has been approved.",
            type: "application",
            relatedExpoId: application.expoId
        });
        return res.status(200).json({ message: "Application approved successfully", application });


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await ExhibitorApplication.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }
        if(application.ApplicationStatus === "Approved" || application.ApplicationStatus === "Rejected") {
            return res.status(400).json({message : "Application is already approved or rejected"})
        }
        application.ApplicationStatus = "Rejected";
        application.reviewedBy = req.user.id;
        application.remarks = req.body.remarks || application.remarks;
        application.reviewedAt = Date.now();
        await application.save();
        await notifyUser(req.app.get("io"), {
            userId: application.exhibitorId,
            title: "Exhibitor application rejected",
            message: application.remarks || "Your exhibitor application has been rejected.",
            type: "application",
            relatedExpoId: application.expoId
        });
        return res.status(200).json({ message: "Application rejected successfully", application });


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getMyApplications = async (req, res) => {
    try {
        const applications = await ExhibitorApplication.find({
            exhibitorId: req.user.id
        }).populate("expoId", "title");

        return res.status(200).json({
            message: "My applications fetched successfully",
            applications
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    CreateApplication,
    getApplications,
    getApplicationById,
    UpdateApplication,
    ApproveApplication,
    rejectApplication,
    getMyApplications
}
