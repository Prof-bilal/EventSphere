const Exhibitor = require("../model/exhibitorProfilemodel");


const CreateExhibitor = async (req, res) => {
    try {
        const { CompanyName, description, products, services, website, contactPerson, phone, category } = req.body;

        const userId = req.user.id;

        const logoFile = req.files?.image?.[0];
        const documentFiles = req.files?.documents || [];

        const logoUrl = logoFile
            ? `/uploads/exhibitor/${logoFile.filename}`
            : undefined;

        const documentUrls = documentFiles.map((file) => `/uploads/exhibitor/${file.filename}`);


        const existing = await Exhibitor.findOne({ UserId: userId });
        if (existing) return res.status(400).json({ message: "You already have a company profile" });
        const createExhibitor = new Exhibitor({ CompanyName, description, products, services, website, category, logoUrl, contactPerson, phone, documents: documentUrls, UserId: userId })

        await createExhibitor.save();
        return res.status(201).json({
            message: "Profile Create Successfully",
            data: createExhibitor
        })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getExhibitor = async (req, res) => {
    try {
        const getdetail = await Exhibitor.find().populate("UserId", "name email");

        return res.status(200).json(getdetail)
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const searchExhibitor = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? {
                $or: [
                    { CompanyName: { $regex: search, $options: "i" } },
                    { products: { $regex: search, $options: "i" } },
                    { services: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        if (req.query.category) filter.category = req.query.category;
        const exhibitors = await Exhibitor.find(filter).select("-documents").populate("UserId", "name email");
        return res.status(200).json(exhibitors);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const editExhibitor = async (req, res) => {
    try {
        const { id } = req.params;

        const existingexhibiitor = await Exhibitor.findById(id);

        if (!existingexhibiitor) {
            return res.status(404).json({ message: "Exhibitor profile not found" });
        }

        if (
            req.user.role !== "admin" &&
            existingexhibiitor.UserId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        const { CompanyName, description, products, services, website, contactPerson, phone, category } = req.body;

        let updatedata = { CompanyName, description, products, services, website, contactPerson, phone, category }

        const logoFile = req.files?.image?.[0];
        const documentFiles = req.files?.documents || [];

        if (logoFile) {
            updatedata.logoUrl = `/uploads/exhibitor/${logoFile.filename}`;
        }

        if (documentFiles.length > 0) {
            const existingDocuments = Array.isArray(existingexhibiitor.documents)
                ? existingexhibiitor.documents
                : existingexhibiitor.documents
                    ? [existingexhibiitor.documents]
                    : [];

            updatedata.documents = [
                ...existingDocuments,
                ...documentFiles.map((file) => `/uploads/exhibitor/${file.filename}`)
            ];
        }

        const updateExhibitor = await Exhibitor.findByIdAndUpdate(id, updatedata, { UpdatedAt : Date.now(), returnDocument: "after", runValidators: true });

        return res.status(200).json({ message: "Data Update Successfully", data: updateExhibitor })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteExhibitor = async (req, res) => {
    try {
        const { id } = req.params;

        const existingexhibiitor = await Exhibitor.findById(id);

        if (!existingexhibiitor) {
            return res.status(404).json({ message: "Exhibitor profile not found" });
        }

        if (
            req.user.role !== "admin" &&
            existingexhibiitor.UserId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "You can only delete your own profile" });
        }

        await Exhibitor.findByIdAndDelete(id);

        res.status(200).json({ message: "Profile Deleted Successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


module.exports = { CreateExhibitor, getExhibitor, searchExhibitor, editExhibitor , deleteExhibitor }
