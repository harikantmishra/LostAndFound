const router = require("express").Router();
const multer = require('multer');
const path = require('path');
const upload = require("../middleware/upload");

const {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  deleteItem,
  updateStatus,
  updateItem,
} = require("../controllers/itemController");

const claimController = require("../controllers/claimController");

const auth = require("../middleware/authMiddleware");


// ✅ updated route
router.post("/", auth, upload.single("image"), createItem);

router.get("/mine", auth, getMyItems);
router.get("/", getItems);

router.post("/:id/claims", auth, claimController.createClaim);
router.get("/:id/claims/me", auth, claimController.getMyClaimForItem);
router.get("/:id/claims", auth, claimController.listClaimsForItem);

router.get("/:id", getItemById);
router.delete("/:id", auth, deleteItem);
router.put("/:id", auth, upload.single("image"), updateItem);
router.put("/:id/status", auth, updateStatus);

module.exports = router;