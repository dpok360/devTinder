const express = require('express');
const { userAuth } = require('../utils/validation');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmails');

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status type',
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message:
            'User not found!, Send connection request to valid users only',
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: 'Connection request already exist' });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      const emailRes = await sendEmail.run(
        'A new friend request from' + req.user.firstName,
        req.user.firstName + 'is' + status + 'in' + toUser.firstName
      );
      console.log(emailRes);

      res.json({
        message:
          req.user.firstName + ' is ' + status + ' in ' + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send({ ERROR: error.message });
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'status not allowed' });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      if (!connectionRequest) {
        return res.status(400).json({ mesage: 'Connection request not found' });
      }
      connectionRequest.status = status;

      res.json({ message: 'connection request ' + status, data });
    } catch (error) {
      res.status(400).send({
        ERROR: error.message,
      });
    }
  }
);

module.exports = requestRouter;
