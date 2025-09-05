// index.js
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running and connected to MongoDB Atlas!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



