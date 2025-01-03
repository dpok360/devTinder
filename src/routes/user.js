const express = require('express');
const { userAuth } = require('../utils/validation');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggesdInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggesdInUser._id,
      status: 'interested',
    }).populate('fromUserId', ['firstName', 'lastName']);

    res.json({ message: 'Data fetched successfully', data: connectionRequest });
  } catch (error) {
    res.status(400).send({ ERROR: error.message });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    }).populate('fromUserId', USER_SAFE_DATA);

    const data = connectionRequests.map((row) => row.fromUserId);

    res.json({ data });
  } catch (error) {
    res.status(400).send({ ERROR: error.message });
  }
});

module.exports = userRouter;
