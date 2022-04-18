const express = require('express');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Goal = require('../models/goalModel');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/usersTasks', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'user',
          as: 'tasks',
        },
      },
      {
        $project: {
          username: '$name',
          tasks: '$tasks',
          numOfTasks: { $size: '$tasks' },
        },
      },
    ]);

    const projects = await Goal.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'goal',
          as: 'tasks',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $project: {
          project_name: '$name',
          description: '$description',
          owner: '$users.name',
          tasks: '$tasks',
          numOfTasks: { $size: '$tasks' },
        },
      },
    ]);

    const tasks = await Task.find();

    // concatinate
    const fullData = {};
    fullData['projects'] = projects;
    fullData['user'] = users;
    fullData['tasks'] = tasks;

    const outputFilename = path.join(__dirname, '/data.json');

    fs.writeFile(
      outputFilename,
      JSON.stringify(fullData, null, 4),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('JSON saved to ' + outputFilename);
        }
      }
    );
    res.send(fullData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const data = await Goal.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'goal',
          as: 'tasks',
        },
      },
      {
        $project: {
          project_name: '$name',
          description: '$description',
          tasks: '$tasks',
          numOfTasks: { $size: '$tasks' },
        },
      },
    ]);

    const outputFilename = path.join(__dirname, '/projects.json');

    fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('JSON saved to ' + outputFilename);
      }
    });
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
