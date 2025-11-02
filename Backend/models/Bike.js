import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bikeName: String,
  image: String,
  pricePerHour: Number,
  available: Boolean,
});

export default mongoose.model("Bike", bikeSchema);
