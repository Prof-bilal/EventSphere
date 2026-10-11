const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "../../uploads/users");


fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },


});

const FileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
        error.status = 400;
        return cb(error, false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: FileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

module.exports = upload;
