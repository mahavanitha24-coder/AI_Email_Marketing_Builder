
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Campaign Routes
app.use("/api/campaigns", campaignRoutes);

// AI Email Generation Routes
app.use("/api/ai", aiRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("AI Email Marketing Backend is Running!");
});

// Check API Routes
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working!"
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Authentication routes loaded!");
      console.log("Campaign routes loaded!");
      console.log("AI Email Generation routes loaded!");
    });
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:",
      error.message
    );
  }
}

startServer();
