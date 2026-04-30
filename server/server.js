const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

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
