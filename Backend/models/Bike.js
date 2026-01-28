import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bikeName: { type: String, required: true },
    image: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    mileage: { type: String, required: true }, // e.g. "45 km/l"
    description: { type: String, required: true },
    tags: [{ type: String }], // e.g. ["sport", "electric"]
    vehicleType: {type: String,enum: ["Bike", "Scooty", "Electric", "Sports"],},
    available: { type: Boolean, default: true },

     ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export default mongoose.model("Bike", bikeSchema);
