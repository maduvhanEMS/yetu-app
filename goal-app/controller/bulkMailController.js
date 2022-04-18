const asyncHandler = require('express-async-handler');

const Bulk = require('../models/bulkMail');

// get mails
//@route GET /api/v1/mail
//access Private
const getMails = asyncHandler(async (req, res) => {
  if (!req.user.role) {
    res.status(400);
    throw new Error('You are not authorized');
  } else {
    const mails = await Bulk.find({});
    res.status(200).json(mails);
  }
});

// create mails
//@route POST /api/v1/
//access Private
const addMail = asyncHandler(async (req, res) => {
  const { text, name } = req.body;
  if (!name || text.length < 1) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //check if the user is an admin
  if (!req.user.role) {
    res.status(400);
    throw new Error('You are not authorized');
  } else {
    const mail = await Bulk.insertMany({
      name,
      text,
    });
    res.status(200).json(mail);
  }
});

// create mails
//@route POST /api/v1/
//access Private
const addBulk = asyncHandler(async (req, res) => {
  const { text, name } = req.body;
  if (!name || text.length < 1) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //check if the user is an admin
  if (!req.user.role) {
    res.status(400);
    throw new Error('You are not authorized');
  } else {
    const mail = await Bulk.insertMany({
      name,
      text,
    });
    res.status(200).json(mail);
  }
});

module.exports = { addMail, addBulk, getMails };
