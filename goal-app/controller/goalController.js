const asyncHandler = require("express-async-handler");

const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// get goals
//@route GET /api/v1/goals
//access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json({ goals });
});

// set goals
//@route POST /api/v1/goals
//access Private
const postGoals = asyncHandler(async (req, res) => {
  const { description, name } = req.body;
  if (!description || !name) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const goal = await Goal.create({
    name: name,
    description: description,
    user: req.user.id,
  });
  res.status(200).json(goal);
});

// update goal
//@route PUT /api/v1/goals/id
//access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // check the user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the logged in user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not Authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

// update goal
//@route DELETE /api/v1/goals/id
//access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // check the user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the logged in user ma
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not Authorized");
  }

  await goal.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getGoals, postGoals, updateGoal, deleteGoal };
