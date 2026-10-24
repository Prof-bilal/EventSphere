const Expo = require('../model/expomodel');
const Registration = require('../model/expoRegistrationsmodel');
const { notifyUser } = require('../services/NotificationService');

const createExpo = async (req, res) => {
    try {

        const { title, description, theme, startDate, endDate, registrationDeadline, status, capacity, location } = req.body;
        const organizerId = req.user.id;

        const imageUrl = req.file
            ? `/uploads/expo/${req.file.filename}`
            : undefined;

        const currentTimestamp = Date.now();
        const parsedStartDate = new Date(startDate).getTime();

        if (parsedStartDate <= currentTimestamp) {
            return res.status(400).json({
                message: "Please provide a valid start date in the future."
            });
        }
        if (endDate <= startDate) {
            return res.status(400).json({ message: "End date must be after the start date." });
        }


        const newExpo = new Expo({
            title, description, theme, startDate, endDate, registrationDeadline, status, capacity, location, imageUrl, organizerId
        })

        await newExpo.save();
        req.app.get("io")?.emit("event:updated", { expoId: newExpo._id });
        res.status(201).json(newExpo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getExpo = async (req, res) => {
    try {
        const { search, status, location } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { theme: { $regex: search, $options: "i" } }
            ];
        }
        if (status) {
            filter.status = status;
        }
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        const expo = await Expo.find(filter).populate("organizerId", "name email")

        res.status(200).json(expo)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getExpoDetail = async (req , res) => {
      try {
        const {id} = req.params;
      

        const getExpo = await Expo.findById(id)

        if (!getExpo) {
            return res.status(404).json({message : "Expo Details not found"})
        }

        return res.status(200).json({
           getExpo
        })

      }
      catch (error) {
         res.status(500).json({error : error.message})
      }
}
const updateExpo = async (req, res) => {
    try {
        const { id } = req.params;

        const existingExpo = await Expo.findById(id);

        if (!existingExpo) {
            return res.status(404).json({ message: "Expo not found" });
        }

        if (req.body.startDate) {
            const currenttime = Date.now();
            const originalStartDate = new Date(existingExpo.startDate).getTime();
            const twodaysinms = 2 * 24 * 60 * 60 * 1000;
            if (originalStartDate - currenttime <= twodaysinms) {
                return res.status(400).json({
                    message: "Cannot update dates. The expo starts within 2 days or has already started."
                });
            }
        }


        let updateddata = { ...req.body }

        if (req.file) {
            updateddata.imageUrl = `/uploads/expo/${req.file.filename}`;
        }


        const updateExpo = await Expo.findByIdAndUpdate(
            id, updateddata, {updatedAt : Date.now(), returnDocument: "after", runValidators: true }
        )

        const registrations = await Registration.find({ expoId: id, status: "registered" }).select("attendeeId");
        req.app.get("io")?.emit("event:updated", { expoId: id });
        await Promise.all(registrations.map((registration) => notifyUser(req.app.get("io"), {
            userId: registration.attendeeId,
            title: "Expo updated",
            message: `${existingExpo.title} has been updated.`,
            type: "expo",
            relatedExpoId: id
        })));



        return res.status(200).json({
            message: "Expo Updated Successfully",
            data: updateExpo
        }
        )
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteExpo = async (req, res) => {
    try {
        const { id } = req.params;
        const existingexpo = await Expo.findById(id);
        if (!existingexpo) {
            return res.status(400).json({ message: "Expo not found " })
        }


        const currenttime = Date.now();
        const eventStartDate = new Date(existingexpo.startDate).getTime();
        const twodayinms = 2 * 24 * 60 * 60 * 1000;

        if (eventStartDate - currenttime <= twodayinms) {
            return res.status(400).json({
                message: "Cannot delete the expo. It starts within 2 days or has already started."
            });
        }

        const registrations = await Registration.find({ expoId: id, status: "registered" }).select("attendeeId");
        await Expo.findByIdAndDelete(id)
        await require("../model/boothmodel").deleteMany({ expoId: id });
        const sessions = await require("../model/Sessionmodel").find({ expoId: id }).select("_id");
        await require("../model/Bookmarkmodel").deleteMany({ sessionId: { $in: sessions.map(item => item._id) } });
        await require("../model/SessionRegistrationmodel").deleteMany({ expoId: id });
        await require("../model/Sessionmodel").deleteMany({ expoId: id });
        await require("../model/exhibitorApplicationmodel").deleteMany({ expoId: id });
        await Registration.deleteMany({ expoId: id });
        req.app.get("io")?.emit("event:updated", { expoId: id });

        await Promise.all(registrations.map((registration) => notifyUser(req.app.get("io"), {
            userId: registration.attendeeId,
            title: "Expo cancelled",
            message: `${existingexpo.title} has been cancelled.`,
            type: "expo",
            relatedExpoId: id
        })));

        return res.status(200).json({ message: "Expo deleted successfully" })


    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createExpo,
    getExpo,
    updateExpo,
    deleteExpo,
    getExpoDetail

}
