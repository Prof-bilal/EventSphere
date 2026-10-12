const mongoose = require('mongoose');

const exposchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for the expo"],
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [50, "Title cannot exceed 50 characters"]       
    },
    description: {
        type: String,
        required: [true, "Please provide a description for the expo"],
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [200, "Description cannot exceed 200 characters"]
    },
    theme: {
        type: String,
        required: [true, "Please provide a theme for the expo"],
        minlength: [3, "Theme must be at least 3 characters long"],
        maxlength: [50, "Theme cannot exceed 50 characters"]
    },
    startDate: {
        type: Date,
        required: [true, "Please provide a start date for the expo"]
    },
    endDate: {
        type: Date,
        required: [true, "Please provide an end date for the expo"]
    },
    registrationDeadline: {
        type: Date,
        required: [true, "Please provide a registration deadline for the expo"]
    },
    status: {
        type: String,
        enum: ["draft", "published", "completed", "cancelled"],
        default: "draft"
    },
    capacity: {
        type: Number,
        required: [true, "Please provide a capacity for the expo"],
        min: [1, "Capacity must be at least 1"],
        max: [10000, "Capacity cannot exceed 10000"]
    },
    location: {
        type: String,
        required: [true, "Please provide a location for the expo"],
        minlength: [3, "Location must be at least 3 characters long"],
        maxlength: [100, "Location cannot exceed 100 characters"]
    },
    imageUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide an organizer ID for the expo"]
    }

})

const Expo = mongoose.model('Expo' , exposchema)
module.exports = Expo
