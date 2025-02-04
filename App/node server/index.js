const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const User = require("./models/User");

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connection to mongoDB: ${error.message}`);
    process.exit(1);
  }
};

connectMongoDB();

// Helper Function for JWT Verification
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json({ ok: false, msg: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json("User not found");
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) return res.status(422).json("Incorrect password");

    const token = jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res
      .cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .json(userDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    const { name, email, _id } = user;
    res.json({ name, email, _id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("jwt", "").json({ success: true });
});

app.post("/gen", verifyToken, async (req, res) => {
  try {
    const { context, answers } = req.body;

    if (!context || !answers) {
      return res
        .status(400)
        .json({ error: "Context and answers are required" });
    }
    console.log(context, answers);
    const flaskApiUrl = "http://127.0.0.1:5000/getques";

    const response = await axios.post(flaskApiUrl, { context, answers });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
