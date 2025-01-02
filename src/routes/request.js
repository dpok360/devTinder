const express = require('express');
const { userAuth } = require('../utils/validation');

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
  const user = req.user;
  console.log('Sending connection req');
  res.send(user.firstName + ' sent connection req sent');
});

module.exports = requestRouter;
