const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Goal = require("../models/goalModel");

//@desc get tasks
//@route GET /api/v1/tasks
//@access private
const getTasks = asyncHandler(async (req, res) => {
  const { goal } = req.body;
  const tasks = await Task.find({
    $and: [{ user: req.user.id }, { goal: goal }],
  });

  res.status(200).json({ tasks });
});

//@desc create a task
//@route POST /api/v1/tasks
//@access private
const postTask = asyncHandler(async (req, res) => {
  const { text, outcomes, goal } = req.body;
  if (!text || !goal) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //add information
  const task = await Task.create({
    text,
    outcomes,
    user: req.user.id,
    goal: goal,
  });
  res.status(200).json(task);
});

//@desc update a task
//@route PUT /api/v1/tasks/id
//@access private
const updateTask = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "update a task" });
});

//@desc delete a task
//@route DELETE /api/v1/tasks/id
//@access private
const deleteTask = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "delete a task" });
});

module.exports = { getTasks, postTask, updateTask, deleteTask };
