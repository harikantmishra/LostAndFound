const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const claimController = require("../controllers/claimController");

router.get("/mine", auth, claimController.listMyClaims);
router.patch("/:id", auth, claimController.updateClaimStatus);

module.exports = router;
