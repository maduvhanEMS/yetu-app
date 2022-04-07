const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  getUsers,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/updatePassword", protect, updateUser);
router.get("/", protect, getUsers);

module.exports = router;
