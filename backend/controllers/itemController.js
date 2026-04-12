const mongoose = require("mongoose");
const Item = require("../models/item");
const Claim = require("../models/claim");

const cloudinary = require("../config/cloudinary");

exports.createItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    const { title, description, location, type } = req.body;

    // 🔥 CLOUDINARY IMAGE URL
    const imageUrl = req.file ? req.file.path : undefined;

    const item = await Item.create({
      title,
      description,
      location,
      type,
      image: imageUrl, // ✅ now cloudinary URL
      user: userId,
    });

    res.json(item);
  } catch (err) {
    const msg =
      err?.message ||
      (err?.name === "ValidationError"
        ? "Invalid item data"
        : "Could not create item");

    res.status(400).json({ msg });
  }
};
exports.getItems = async (req, res) => {
  try {
    const { q, type } = req.query;
    const filter = {};

    if (type && ["lost", "found"].includes(type)) {
      filter.type = type;
    }

    if (q && String(q).trim()) {
      const escaped = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
      ];
    }

    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Could not load items" });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const items = await Item.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Could not load your listings" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid id" });
    }
    const item = await Item.findById(id)
      .populate("user", "name email")
      .populate("returnedTo", "name email");
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: "Could not load item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    if (item.user.toString() !== String(userId)) {
      return res.status(403).json({ msg: "You can only delete your own listings" });
    }

    // 🔥 DELETE IMAGE FILE
    if (item.image) {
  try {
    const publicId = item.image
      .split("/")
      .slice(-1)[0]     // last part
      .split(".")[0];   // remove extension

    await cloudinary.uploader.destroy(`lost_found/${publicId}`);
  } catch (err) {
    console.log("Cloudinary delete error:", err);
  }
}

    // existing logic
    await Claim.deleteMany({ item: req.params.id });
    await Item.findByIdAndDelete(req.params.id);

    res.json({ msg: "Deleted" });

  } catch (err) {
    res.status(400).json({ msg: "Could not delete item" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    if (item.user.toString() !== String(userId)) {
      return res.status(403).json({ msg: "Not allowed" });
    }
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "claimed" },
      { new:true }
    )
      .populate("user", "name email")
      .populate("returnedTo", "name email");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: "Could not update status" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    if (item.user.toString() !== String(userId)) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const { title, description, location, type } = req.body;

    let imageUrl = item.image; // keep old image

    // 🔥 if new image uploaded
    if (req.file) {
      // delete old image from cloudinary
      if (item.image) {
        const publicId = item.image
          .split("/")
          .slice(-1)[0]
          .split(".")[0];

        await cloudinary.uploader.destroy(`lost_found/${publicId}`);
      }

      imageUrl = req.file.path; // new image
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        location,
        type,
        image: imageUrl,
      },
      { new: true }
    );

    res.json(updatedItem);

  } catch (err) {
    res.status(400).json({ msg: "Could not update item" });
  }
};