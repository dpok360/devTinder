const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const http = require('http');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');
const chatRouter = require('./routes/chat');
const initializeServer = require('./utils/socket');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter);
app.use('/', chatRouter);

//for socket io
const server = http.createServer(app);
initializeServer(server);

connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log('Server is successfully listening at port 3000');
  });
});
