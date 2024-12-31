const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res) => {
  const userObj = {
    firstName: 'dpok',
    lastName: 'surya',
    emailid: 'abcd@dpok.com',
    password: 'abcded',
    age: 5,
    gender: 'm',
  };
  //creating a new instance of the User model
  const user = new User(userObj);

  try {
    await user.save();
    res.send('User added successfully');
  } catch (error) {
    res.status(400).send('Error saving user ', error.message);
  }
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is successfully listening at port 3000');
  });
});
