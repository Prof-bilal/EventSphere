const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema({
    boothNumber : {
        type : String,
        required : [true , "Please provide a booth number"],
        unique : true,
    },
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : [true , "Please provide an expo ID for the booth"]
    },
    exhibitorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    boothType : {
        type : String,
        enum : ["Standard", "Premium"],
        required : [true , "Please provide a booth type for the booth"]
    },
    floorName : {
        type : String,
        required : [true , "Please provide a floor name for the booth"]
    },
    position : {
        type : {
            x : {
                type : Number,
                required : true
            },
            y : {
                type : Number,
                required : true
            },
            width : {
                type : Number,
                required : true
            },
            height : {
                type : Number,
                required : true
            }
        },
        required : [true , "Please provide a position for the booth"]
    },
    size : {
        type : {
            width : {
                type : Number,
                required : true
            },
            height : {
                type : Number,
                required : true
            }
        },
        required : [true , "Please provide a size for the booth"]
    },
    price : {
        type : Number,
        required : [true , "Please provide a price for the booth"]
    },
    status : {
        type : String,
        enum : ["available" , "booked"],
        default : "available"
    },
    requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    products: { type: String, default: "" },
    services: { type: String, default: "" },
    staff: { type: String, default: "" },
    visits: { type: Number, default: 0 },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }

})

const Booth = mongoose.model("Booth", boothSchema)
module.exports = Booth
