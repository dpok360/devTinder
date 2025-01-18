const { tr } = require('date-fns/locale');
const mongoose = require('mongoose');
const { type } = require('os');

const paymentsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
      },
      emailId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);
const Payment = mongoose.model('Payment', paymentsSchema);
module.exports = Payment;
