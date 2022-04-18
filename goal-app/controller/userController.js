const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

//@desc  register a user
//@route POST /api/v1/goals
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //check if user exist
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exist');
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create a user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: req.body.role,
  });

  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      counter: user.counter,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@desc  Aunthenticate a user
//@route POST /api/v1/goals
//@access Private
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check for user email
  const user = await User.findOne({ email });

  //compare passwords
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.counter < 1) {
      await User.findByIdAndUpdate(user.id, { $inc: { counter: 1 } });
    }

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      counter: user.counter,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

//@desc  Aunthenticate a user
//@route get /api/v1/users
//@access Private
const getUsers = asyncHandler(async (req, res) => {
  // check for user email
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  //if found get all the users - password
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

//@desc  update a user
//@route POST /api/v1/goals
//@access Public
const updateUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //check if user exist
  const userExist = await User.findById(req.user.id);

  if (!userExist) {
    res.status(400);
    throw new Error('User does not exist');
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //update a user password

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { password: hashedPassword },
    {
      new: true,
    }
  );

  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      counter: user.counter,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@desc  get a user
//@route GET /api/v1/goals
//@access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//Generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = { registerUser, loginUser, getMe, updateUser, getUsers };
