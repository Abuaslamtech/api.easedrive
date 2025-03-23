import express from "express";
import { createRental, getUserRentals, getRentalById, updateRentalStatus, cancelRental } from "../controllers/rentalController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// All routes should be protected with authentication
router.use(verifyToken);

// Rental routes
router.post("/", createRental);
router.get("/user", getUserRentals);
router.get("/:id", getRentalById);
router.patch("/:id/status", updateRentalStatus);
router.patch("/:id/cancel", cancelRental);

export default router;