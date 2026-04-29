const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

dotenv.config({ path: "./.env" });

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Mark3 Task Assistant API Running...");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});