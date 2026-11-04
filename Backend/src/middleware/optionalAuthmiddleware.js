const jwt = require("jsonwebtoken");
const revokedTokenModel = require("../model/revokesession");
const User = require("../model/Usermodel");


const optionalAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const revoked = await revokedTokenModel.findOne({ jti: decoded.jti });
        const user = await User.findById(decoded.id).select("IsBlocked IsActive role");
        if (!revoked && user && !user.IsBlocked && user.IsActive) {
            req.user = decoded;
        }
    } catch (error) {
        console.error("Error in optionalAuthMiddleware:", error);
    }

    next();
};

module.exports = optionalAuthMiddleware;
