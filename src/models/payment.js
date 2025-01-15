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

module.exports = mongoose.model('Payment', paymentsSchema);

// "id": "order_EKwxwAgItmmXdp",
//   "entity": "order",
//   "amount": 50000,
//   "amount_paid": 0,
//   "amount_due": 50000,
//   "currency": "INR",
//   "receipt": "receipt#1",
//   "offer_id": null,
//   "status": "created",
//   "attempts": 0,
//   "notes": [],
//   "created_at": 1582628071
