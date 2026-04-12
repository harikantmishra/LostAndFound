const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  type: { type: String, enum: ["lost", "found"] },
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "open" },
  returnedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);