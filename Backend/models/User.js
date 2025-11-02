import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  username: String,
  password: String,
  role: { type: String, enum: ["renter", "owner"] },
  idCard: String,
  license: String,
});

export default mongoose.model("User", userSchema);
