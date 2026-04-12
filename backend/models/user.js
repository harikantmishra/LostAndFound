const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    trim: true,
    default: "",
  },
  course: {
    type: String,
    trim: true,
    default: "",
  },
  year: {
    type: String,
    trim: true,
    default: "",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 300,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
