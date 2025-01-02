const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error('Name is not valid');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Token is not valid');
    }
    const decodedobj = await jwt.verify(token, 'deepak@123');
    const { _id } = decodedobj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({
      ERROR: error.message,
    });
  }
};

const validateProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'photoUrl',
    'gender',
    'age',
    'about',
    'skills',
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, userAuth, validateProfileData };
