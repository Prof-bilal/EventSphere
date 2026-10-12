const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsRoot = path.join(__dirname, "../../uploads");
const allowedFolders = new Set(["users", "expo" , "exhibitor"]);

const fileFilter = (folderName, req, file, cb) => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const documentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ...imageTypes
    ];

    const allowedTypes = folderName === "exhibitor" && file.fieldname === "documents"
        ? documentTypes
        : imageTypes;

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Invalid file type.");
        error.status = 400;
        return cb(error, false);
    }

    cb(null, true);
};

function forFolder(folderName) {
    if (!allowedFolders.has(folderName)) {
        throw new Error("Invalid upload folder");
    }

    const destination = path.join(uploadsRoot, folderName);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            fs.mkdir(destination, { recursive: true }, (error) => {
                cb(error, destination);
            });
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
        },
    });

    return multer({
        storage,
        fileFilter: (req, file, cb) => fileFilter(folderName, req, file, cb),
        limits: { fileSize: 5 * 1024 * 1024 },
    });
}

module.exports = { forFolder };
