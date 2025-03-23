import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import rentalRoutes from "./src/routes/rentalRoutes.js";
import connectDB from "./src/config/db.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

// connect DB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/rentals", rentalRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});