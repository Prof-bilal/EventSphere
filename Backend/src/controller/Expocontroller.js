const Expo = require('../model/expomodel');

const createExpo = async (req, res) => {
    try {
        const { title, description, theme, startDate, endDate, registrationDeadline, status, capacity, location, imageUrl, organizerId } = req.body;

        const newExpo = new Expo({
            title, description, theme, startDate, endDate, registrationDeadline, status, capacity, location, imageUrl, organizerId
        })

        await newExpo.save();
        res.status(201).json(newExpo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createExpo
}