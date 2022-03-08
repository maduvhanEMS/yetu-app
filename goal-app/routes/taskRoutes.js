const express = require("express");
const router = express.Router();
const {
  getTasks,
  postTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTasks).post(protect, postTask);
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
