const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is successfully listening at port 3000');
  });
});
