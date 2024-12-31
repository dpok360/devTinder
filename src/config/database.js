const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const coonection = await mongoose.connect(
      'mongodb+srv://sumirtraders:d8wYb1IEp1doIdN3@cluster0.dqb7k.mongodb.net/devTinder'
    );
    if (coonection) {
      console.log('DB connection successfull');
    }
  } catch (error) {
    console.log('Error connecting DB');
    console.error(error.message);
  }
};

module.exports = connectDB;
