const express = require('express');
const {
  getGoals,
  postGoals,
  updateGoal,
  deleteGoal,
  getGoalsPerUser,
} = require('../controller/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, postGoals);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);
router.route('/stats').get(getGoalsPerUser);

module.exports = router;
