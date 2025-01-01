const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {
  //creating a new instance of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send('User added successfully');
  } catch (error) {
    res.status(400).send({
      message: 'Error saving user ',
      err: error.message,
    });
  }
});

//get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send('Something went wromg');
  }
});

app.get('/feeed', async (req, res) => {});

app.get('/getUser', async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      res.status(404).send('not found');
    } else res.status(200).send(user);
  } catch (error) {
    res.status(400).send('something went wrong');
  }
});

app.delete('/user/', async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send('user not found');
    } else {
      res.send('User deleted successfully');
    }
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const ALLOW_UPDATES = [
    'photoUrl',
    'about',
    'gender',
    'age',
    'skills',
    'password',
    'firstName',
    'lastName',
  ];

  try {
    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOW_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }
    if (req.body?.skills.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }

    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!user) {
      throw new Error('Upadte failed');
    } else {
      res.send({
        message: 'User updaed successfully',
        data: { user },
      });
    }
  } catch (error) {
    res.status(400).send('Something went wrong ' + error.message);
  }
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is successfully listening at port 3000');
  });
});
