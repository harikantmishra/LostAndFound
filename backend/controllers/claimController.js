const mongoose = require("mongoose");
const Claim = require("../models/claim");
const Item = require("../models/item");

exports.createClaim = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id: itemId } = req.params;
    const { message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ msg: "Invalid item id" });
    }
    if (!message || !String(message).trim()) {
      return res.status(400).json({ msg: "Please describe why this item is yours" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    if (item.status === "claimed") {
      return res.status(400).json({ msg: "This listing is already resolved" });
    }
    if (item.user.toString() === String(userId)) {
      return res.status(400).json({ msg: "You cannot claim your own listing" });
    }

    const pending = await Claim.findOne({
      item: itemId,
      claimant: userId,
      status: "pending",
    });
    if (pending) {
      return res.status(400).json({ msg: "You already have a pending claim for this item" });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: userId,
      message: String(message).trim(),
    });

    const populated = await Claim.findById(claim._id)
      .populate("claimant", "name email")
      .populate("item", "title");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Could not submit claim" });
  }
};

exports.getMyClaimForItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id: itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ msg: "Invalid item id" });
    }

    const claim = await Claim.findOne({ item: itemId, claimant: userId })
      .sort({ createdAt: -1 })
      .populate("claimant", "name email");

    res.json(claim);
  } catch (err) {
    res.status(500).json({ msg: "Could not load claim" });
  }
};

exports.listClaimsForItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id: itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ msg: "Invalid item id" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    if (item.user.toString() !== String(userId)) {
      return res.status(403).json({ msg: "Only the listing owner can view claims" });
    }

    const claims = await Claim.find({ item: itemId })
      .sort({ createdAt: -1 })
      .populate("claimant", "name email");

    res.json(claims);
  } catch (err) {
    res.status(500).json({ msg: "Could not load claims" });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.user?._id;
    const { id: claimId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Status must be approved or rejected" });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ msg: "Claim not found" });
    }

    const item = await Item.findById(claim.item);
    if (!item || item.user.toString() !== String(ownerId)) {
      return res.status(403).json({ msg: "Only the listing owner can respond to claims" });
    }

    if (item.status === "claimed" && status === "approved") {
      return res.status(400).json({ msg: "This listing is already resolved" });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      await Claim.updateMany(
        {
          item: item._id,
          _id: { $ne: claim._id },
          status: "pending",
        },
        { status: "rejected" }
      );

      item.status = "claimed";
      item.returnedTo = claim.claimant;
      await item.save();
    }

    const updated = await Claim.findById(claim._id)
      .populate("claimant", "name email")
      .populate("item", "title");

    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Could not update claim" });
  }
};

exports.listMyClaims = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const claims = await Claim.find({ claimant: userId })
      .sort({ createdAt: -1 })
      .populate("item", "title type status location image")
      .populate("claimant", "name email");

    res.json(claims);
  } catch (err) {
    res.status(500).json({ msg: "Could not load your claims" });
  }
};
