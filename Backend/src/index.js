require("dotenv").config();

const express = require("express");
const connectDB = require("./db/db.js");
const authroutes = require("./routes/authroutes.js");
const exporoutes = require("./routes/exporoutes.js");
const exhibitorroutes = require("./routes/exhibitorroutes.js");
const exhibitorApplicationroutes = require("./routes/exhibitorApplicationroutes.js");
const boothRoute = require("./routes/BoothRoute.js");
const sessionsRoute = require("./routes/Sessionsroute.js");
const expoRegistrationRoute = require("./routes/exporegistrationroutes.js");
const bookmarkRoutes = require("./routes/Bookmarkroutes.js");
const notificationRoutes = require("./routes/Notificationroutes.js");
const feedbackRoutes = require("./routes/Feedbackroutes.js");
const messageRoutes = require("./routes/Messageroutes.js");
const analyticsRoutes = require("./routes/Analyticsroutes.js");
const attendeeRoutes = require("./routes/Attendeeroutes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authroutes);
app.use("/api/expo", exporoutes)
app.use("/api/exhibitor", exhibitorroutes);
app.use("/api/exhibitorApplication", exhibitorApplicationroutes);
app.use("/api/booth", boothRoute);
app.use("/api/session", sessionsRoute);
app.use("/api/expoRegistration", expoRegistrationRoute);
app.use("/api/bookmark", bookmarkRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/attendee", attendeeRoutes);
app.set("io", io);

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication required"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch (error) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    socket.join(socket.user.id.toString());
});

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
