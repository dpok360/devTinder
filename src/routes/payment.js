const express = require('express');
const { userAuth } = require('../utils/validation');
const razorpayIntance = require('../utils/razorpay');
const Payment = require('../models/payment');
const membershipAmount = require('../utils/constants');
const {
  validateWebhookSignature,
} = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

const paymentRouter = express.Router();

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayIntance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: 'INR',
      receipt: 'receipt#1',
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

paymentRouter.post('/payment/webhook', async (req, res) => {
  try {
    //const webhookSignature = req.headers['X-Razorpay-Signature']; both same
    const webhookSignature = req.get['X-Razorpay-Signature'];
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: 'Webhook signature is invalid' });
    }
    //Update payment status in DB
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    //Update the user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();
    //Return sucess response to razorpay
    return res.status(200).json({ msg: 'Webhook received successfully' });

    // if (req.body.event === 'payment.captured') {
    // }
    // if (req.body.event === 'payment.failed') {
    // }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = paymentRouter;
