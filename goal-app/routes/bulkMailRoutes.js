const express = require('express');
const {
  getMails,
  addMail,
  addBulk,
} = require('../controller/bulkMailController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getMails).post(protect, addMail);
router.route('/bulk').post(protect, addBulk);

module.exports = router;
