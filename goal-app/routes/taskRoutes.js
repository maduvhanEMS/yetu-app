const express = require("express");

const router = express.Router();
const {
  getTask,
  getTasks,
  postTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, postTask).get(protect, getTasks);

router.route("/:goalId").get(protect, getTask);
router.route("/:id").put(protect, updateTask).delete(deleteTask);

module.exports = router;
