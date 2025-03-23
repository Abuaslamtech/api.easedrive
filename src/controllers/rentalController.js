import Rental from "../models/Rental.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper function to extract user ID from token
const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Create a new rental
export const createRental = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const { car, rentalDetails, paymentInfo } = req.body;

    // Calculate total cost based on number of days
    const startDate = new Date(rentalDetails.startDate);
    const endDate = new Date(rentalDetails.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalCost = daysDiff * car.price;

    const newRental = new Rental({
      user: userId,
      car,
      rentalDetails: {
        ...rentalDetails,
        totalCost
      },
      paymentInfo
    });

    await newRental.save();
    
    res.status(201).json({ 
      message: "Rental created successfully", 
      rental: newRental 
    });
  } catch (error) {
    console.error("Rental creation error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all rentals for a user
export const getUserRentals = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    
    const rentals = await Rental.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ rentals });
  } catch (error) {
    console.error("Get rentals error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get rental details by ID
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    
    const rental = await Rental.findById(id);
    
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    
    // Ensure user owns this rental
    if (rental.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your rental" });
    }
    
    res.status(200).json({ rental });
  } catch (error) {
    console.error("Get rental error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update rental status
export const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    
    const rental = await Rental.findById(id);
    
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    
    // Ensure user owns this rental
    if (rental.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your rental" });
    }
    
    rental.rentalDetails.status = status;
    await rental.save();
    
    res.status(200).json({ message: "Rental status updated", rental });
  } catch (error) {
    console.error("Update rental error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Cancel rental
export const cancelRental = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    
    const rental = await Rental.findById(id);
    
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    
    // Ensure user owns this rental
    if (rental.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your rental" });
    }
    
    // Only allow cancellation of pending or active rentals
    if (!['pending', 'active'].includes(rental.rentalDetails.status)) {
      return res.status(400).json({ message: "Cannot cancel completed rentals" });
    }
    
    rental.rentalDetails.status = 'cancelled';
    await rental.save();
    
    res.status(200).json({ message: "Rental cancelled", rental });
  } catch (error) {
    console.error("Cancel rental error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};