const Exhibitor = require("../model/exhibitorProfilemodel");


const CreateExhibitor = async (req, res) => {
    try {
        const { CompanyName, description, products, services, website, contactPerson, phone, documents } = req.body;

        const userId = req.user.id || req.body.id;

        const logoUrl = req.file
            ? `/uploads/exhibitor/${req.file.filename}`
            : undefined;


        const createExhibitor = new Exhibitor({ CompanyName, description, products, services, website, logoUrl, contactPerson, phone, documents, UserId: userId })

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

const editExhibitor = async (req, res) => {
    try {
        const { id } = req.params;


        let updatedata = { ...req.body }

        if (req.file) {
            updatedata.logoUrl = `/uploads/exhibitor/${req.file.filename}`;
        }

        const existingexhibiitor = await Exhibitor.findByIdAndUpdate(id, updatedata, { returnDocument: "after", runValidators: true });



        return res.status(200).json({ message: "Data Update Successfully", data: existingexhibiitor })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteExhibitor = async (req, res) => {
    try {
        const { id } = req.params;

        await Exhibitor.findByIdAndDelete(id);

        res.status(200).json({ message: "Profile Deleted Successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


module.exports = { CreateExhibitor, getExhibitor, editExhibitor , deleteExhibitor }