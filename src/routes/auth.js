const express = require('express');
const { validateSignUpData, userAuth } = require('../utils/validation');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    validateSignUpData(req);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send('User added successfully');
  } catch (error) {
    res.status(400).send({
      ERROR: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send(user);
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send({
      ERROR: error.message,
    });
  }
});

router.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.send('Logged out succesfully !');
});

module.exports = router;
