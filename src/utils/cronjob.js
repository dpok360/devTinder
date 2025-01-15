const cron = require('node-cron');
const sendEmail = require('../utils/sendEmails');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const ConnectionRequest = require('../models/connectionRequest');

//Runs at 8AM in the morning every day
cron.schedule('0 8 * * *', async () => {
  //Send emails to all people who get requests prev day
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);
  try {
    const pendingRequests = await ConnectionRequest.find({
      status: 'interested',
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate('fromUserId toUserId');
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    for (const email of listOfEmails) {
      //send emails

      //use beequeue lib for queing send emials

      try {
        const res = await sendEmail().run(
          'New Friend Requests pending from' + email,
          'There are so many friend requets pending.Please log in and accept or reject requests'
        );
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
