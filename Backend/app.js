const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./src/routes");

// Load .env variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN, // only frontend allowed
  credentials: true                 // allow cookies / auth headers
}));

app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use("/", router);

// MongoDB connection
const PORT = process.env.BACKEND_PORT || 8080;

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true
    });
    console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection FAILED:", error);
    process.exit(1);
  }
}
connectDB();

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully.");
});

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

module.exports = app;
