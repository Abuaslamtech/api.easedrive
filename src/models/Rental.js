import mongoose from "mongoose";

const RentalSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  car: {
    id: { type: Number, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String }
  },
  rentalDetails: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  paymentInfo: {
    paymentId: { type: String },
    paymentDate: { type: Date },
    paymentMethod: { type: String }
  },
  createdAt: { 
    type: Date,
    default: Date.now
  }
});

const Rental = mongoose.model("Rental", RentalSchema, "rentals");

export default Rental;