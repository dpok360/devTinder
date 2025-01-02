const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    formUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: Strig,
      required: true,
      enum: { values: ['ignored', 'interested', 'accepted', 'rejected'] },
      message: 'incorrect status type',
    },
  },
  { timeStamp: true }
);

const ConnectionRequest = new mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
);
module.exports = ConnectionRequest;
