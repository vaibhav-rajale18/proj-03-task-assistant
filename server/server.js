const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Mark3 Task Assistant API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
