const mongoose = require("mongoose")

const ExhibitorApplicationSchema = new mongoose.Schema({
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expo",
        required: true
    },
    exhibitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ApplicationStatus: {
        type: String,
        enum: ["Applied", "Approved", "Rejected"],
        default: "Applied"
    },
    submittedDocuments: {
        type: [String],
        default: []
    },
    remarks: {
        type: String,
        default: ""
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

ExhibitorApplicationSchema.index({ expoId: 1, exhibitorId: 1 }, { unique: true });

const ExhibitorApplication = mongoose.model("ExhibitorApplication", ExhibitorApplicationSchema)
module.exports = ExhibitorApplication
