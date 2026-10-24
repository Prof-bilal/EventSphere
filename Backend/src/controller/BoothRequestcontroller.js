const Booth = require("../model/boothmodel");
const Application = require("../model/exhibitorApplicationmodel");
const Expo = require("../model/expomodel");
const { notifyUser } = require("../services/NotificationService");

const requestBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id);
        if (!booth) return res.status(404).json({ message: "Booth not found" });
        if (booth.status !== "available") return res.status(400).json({ message: "Booth is already booked" });
        const application = await Application.findOne({ expoId: booth.expoId, exhibitorId: req.user.id, ApplicationStatus: "Approved" });
        if (!application) return res.status(400).json({ message: "Your expo application must be approved first" });
        if (booth.requestedBy.some(id => id.toString() === req.user.id)) return res.status(400).json({ message: "You have already requested this booth" });
        await Booth.findByIdAndUpdate(booth._id, { $addToSet: { requestedBy: req.user.id } });
        const expo = await Expo.findById(booth.expoId);
        await notifyUser(req.app.get("io"), { userId: expo.organizerId, title: "Booth requested", message: `An exhibitor requested ${booth.boothNumber}.`, type: "booth", relatedExpoId: expo._id, email: false });
        return res.status(200).json({ message: "Booth request sent" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateDetails = async (req, res) => {
    try {
        const booth = await Booth.findOne({ _id: req.params.id, exhibitorId: req.user.id });
        if (!booth) return res.status(404).json({ message: "Your assigned booth was not found" });
        const { products, services, staff } = req.body;
        booth.products = products;
        booth.services = services;
        booth.staff = staff;
        await booth.save();
        req.app.get("io")?.emit("event:updated", { expoId: booth.expoId });
        return res.status(200).json({ message: "Booth details saved", booth });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const visitBooth = async (req, res) => {
    try {
        const booth = await Booth.findByIdAndUpdate(req.params.id, { $inc: { visits: 1 } }, { new: true });
        if (!booth) return res.status(404).json({ message: "Booth not found" });
        req.app.get("io")?.emit("event:updated", { expoId: booth.expoId });
        return res.status(200).json({ message: "Booth visit recorded" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { requestBooth, updateDetails, visitBooth };
