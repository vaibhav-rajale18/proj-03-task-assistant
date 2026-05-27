const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// Connect Database
connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Root Test Route
app.get("/", (req, res) => {
  res.send("Mark3 Task Assistant API Running...");
});

// Protected Route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: {
      userId: req.user.userId,
      email: req.user.email,
    },
  });
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
