require("dotenv").config();

const express = require("express");
const connectDB = require("./db/db.js");
const authroutes = require("./routes/authroutes.js");
const exporoutes = require("./routes/exporoutes.js");
const exhibitorroutes = require("./routes/exhibitorroutes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authroutes);
app.use("/api/expo" , exporoutes)
app.use("/api/exhibitor" , exhibitorroutes);

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
