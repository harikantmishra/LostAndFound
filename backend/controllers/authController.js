const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      course,
      year,
      phone,
      bio,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      course,
      year,
      phone,
      bio,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      course: user.course,
      year: user.year,
      phone: user.phone,
      bio: user.bio,
    });
  } catch (err) {
    res.status(400).json({
      msg:
        err?.code === 11000
          ? "Email already registered"
          : "Registration failed",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);

  res.json({ token });
};

exports.me = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: "Invalid token payload" });

    const user = await User.findById(userId).select(
      "name email department course year phone bio createdAt"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Could not load profile" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: "Invalid token payload" });

    const { name, department, course, year, phone, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        department,
        course,
        year,
        phone,
        bio,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email department course year phone bio createdAt");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ msg: "Could not update profile" });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    const user = await User.findById(id).select(
      "name email department course year phone bio createdAt"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Could not load user profile" });
  }
};
