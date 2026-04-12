const router = require("express").Router();
const {
  register,
  login,
  me,
  updateMe,
  getPublicProfile,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.put("/me", auth, updateMe);
router.get("/users/:id", getPublicProfile);

module.exports = router;
