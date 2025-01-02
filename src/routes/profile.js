const express = require('express');
const { userAuth, validateProfileData } = require('../utils/validation');
const User = require('../models/user');
const validate = require('validator');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send({
      ERROR: error.message,
    });
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error('Invalid edit request');
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    console.log(loggedUser);
    res.json({
      message: `${loggedUser.firstName}, your profile has been edited succesfully`,
      data: loggedUser,
    });
  } catch (error) {
    res.status(400).send({ ERROR: error.message });
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const isStrongPassword = validate.isStrongPassword(req.body.password);
    if (!isStrongPassword) {
      throw new Error('weak password');
    }
    req.user.password = req.body.password;
    const hasedPassword = await bcrypt.hash(req.user.password, 10);
    const result = await User.findByIdAndUpdate(req.user._id, {
      password: hasedPassword,
    });
    if (!result) {
      throw new Error('Updating password failed');
    }
    res.send('Password updated succesfully');
  } catch (error) {
    res.send({ ERROR: error.message });
  }
});

module.exports = profileRouter;
