const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Goal = require('../models/goalModel');

//@desc get tasks
//@route GET /api/v1/tasks
//@access private
const getTasks = asyncHandler(async (req, res) => {
  // const { goalId } = req.params;
  const tasks = await Task.find({});

  //$and: [{ user: req.user.id }, { goal: goalId }],

  res.status(200).json(tasks);
});

//@desc get tasks
//@route GET /api/v1/tasks/projectId
//@access private
const getTask = asyncHandler(async (req, res) => {
  const { goalId } = req.params;
  if (!req.user) {
    res.status(401);

    throw new Error('User not found');
  }
  const tasks = await Task.find({ goal: goalId }).populate('user', '-password');
  res.status(200).json(tasks);
});

//@desc create a task
//@route POST /api/v1/tasks
//@access private
const postTask = asyncHandler(async (req, res) => {
  const {
    task_name,
    goal,
    objective,
    userId,
    startDate,
    endDate,
    dependencies,
    duration,
  } = req.body;
  console.log(req.body);
  if (!task_name || !endDate || !goal || !objective || !userId) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  if (!req.user.role) {
    res.status(401);
    throw new Error('You are not authorized');
  }

  //add information
  const task = await Task.create({
    task_name,
    startDate,
    endDate,
    objective,
    user: userId,
    goal: goal,
    duration,
    dependencies,
  });
  console.log(task);
  res.status(200).json(task);
});

//@desc update a task
//@route PUT /api/v1/tasks/id
//@access private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(400);
    throw new Error('Task not found');
  }
  // check the user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (!req.user.role) {
    res.status(401);
    throw new Error('User not Authorized');
  }
  //update task
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('user');
  res.status(200).json(updatedTask);
});

//@desc delete a task
//@route DELETE /api/v1/tasks/id
//@access private
const deleteTask = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'delete a task' });
});

module.exports = { getTasks, postTask, updateTask, deleteTask, getTask };
