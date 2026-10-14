const jwt = require("jsonwebtoken");
const revokedTokenModel = require("../model/revokesession");
const User = require("../model/Usermodel");

const authMiddleware = async  (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Please Login First" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const revoke = await revokedTokenModel.findOne({ jti: decoded.jti });
        if (revoke) {
            return res.status(401).json({ message: "Token has been revoked. Please login again." });
        }
        const user = await User.findById(decoded.id).select("IsBlocked IsActive");
        if (!user || user.IsBlocked || !user.IsActive) {
            return res.status(403).json({ message: "Your account is blocked or inactive" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
