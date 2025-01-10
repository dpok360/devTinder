const mongoose = require('mongoose');

const connectDB = async () => {
  const DB_STRING = process.env.DB_CONNECTION_STRING.replace(
    '<password>',
    process.env.DB_CONN_SECRET
  );

  try {
    const coonection = await mongoose.connect(DB_STRING);
    if (coonection) {
      console.log('DB connection successfull');
    }
  } catch (error) {
    console.log('Error connecting DB');
    console.error(error.message);
  }
};

module.exports = connectDB;
