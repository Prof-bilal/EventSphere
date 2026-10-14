const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema({
    title : {
        type : String,
        required : [true , "Please Enter Session Title"],
        minLength : [3 , "Session Title Should Be At Least 3 Character"],
        maxLength : [100 , "Session Title Should Be At Most 100 Character"],
        match : [/^a-zA-Z0-9\s]*$/ , "Session Title Should Only Contain Alpha"],
    },
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : [true , "Please Select Expo"],
    },
    exhibitorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    boothId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Booth",
    },
    startDate : {
        type : Date,
        required : [true , "Please Select Start Date"],
    },
    startTime : {
        type : String,
        required : [true , "Please Enter Start Time"],
    },
    endTime : {
        type : String,
        required : [true , "Please Enter End Time"],
    },
    speakerName : {
        type : String,
        required : [true , "Please Enter Speaker Name"],
        minLength : [3 , "Speaker Name Should Be At Least 3 Character"],
        maxLength : [100 , "Speaker Name Should Be At Most 100 Character"],
        match : [/^a-zA-Z\s]*$/ , "Speaker Name Should Only Contain Alpha"],
    },
    topic : {
        type : String,
        required : [true , "Please Enter Topic"],
        minLength : [3 , "Topic Should Be At Least 3 Character"],
        maxLength : [100 , "Topic Should Be At Most 100 Character"],
        match : [/^a-zA-Z0-9\s]*$/ , "Topic Should Only Contain Alpha"],
    },
    description : {
        type : String,
        required : [true , "Please Enter Description"],
        minLength : [3 , "Description Should Be At Least 3 Character"],
        maxLength : [1000 , "Description Should Be At Most 1000 Character"],
    },
    sessionType : {
        type : String,
        enum : ["session" , "workshop" , "seminar"],
        required : [true , "Please Select Session Type"],
    },
    capacity : {
        type : Number,
        required : [true , "Please Enter Capacity"],
        min : [1 , "Capacity Should Be At Least 1"],
        max : [240 , "Capacity Should Be At Most 240"],
    },
    fee : {
        type : Number,
        required : [true , "Please Enter Fee"],
        min : [0 , "Fee Should Be At Least 0"],
    },
    status : {
        type : String,
        enum : ["active" , "inactive"],
        default : "active",
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    updatedAt : {
        type : Date,
        default : Date.now(),
    },
})

const Sessions = mongoose.model("Session", SessionSchema);
module.exports = Sessions;