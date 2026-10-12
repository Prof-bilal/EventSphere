const mongoose = require("mongoose")

const exhibitorProfileSchema = mongoose.Schema({
    CompanyName: {
        type: String,
        required: [true, "Please Provide Company Name "],
        minlength: [3, "Please Enter more then 3 characters"],
        maxlength: [50, "Please Enter under 50 characters"],
        match: /^[a-zA-Z]+$/
    },
    description: {
        type: String,
        required: [true, "Please provide description"],
        minlength: [10, "Please Enter more then 10 Characters"],
        maxlength: [100, "Please Ender under 100 characters"],
        match: /^[a-zA-Z]+$/
    },
    products: {
        type: String,
        minlength: [3, "Please Enter more then 3 Characters long"]
    },
    services: {
        type: String,
        minlength: [3, "Please Enter more then 3 Characters long"]
    },
    website: {
        type: String,
        match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, "Please provide a valid website URL"]
    },
    logoUrl: {
        type: String
    },
    contactPerson: {
        type: String,
        required: [true, "Please Enter a contact person name "],
        minlength: [3, "Please Enter 3 characters long"]
    },
    phone: {
        type: Number,
        required: [true, "Please Provide contact person contact no"]
    },
    documents: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide an organizer ID for the expo"]
    }
})


const Exhibitor = mongoose.model('ExhibitorProfile', exhibitorProfileSchema);
module.exports = Exhibitor;