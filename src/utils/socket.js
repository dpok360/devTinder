const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');
const ConnectionRequest = require('../models/connectionRequest');
const jwt = require('jsonwebtoken');

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('_'))
    .digest('hex');
};

const onlineUsers = new Set();

const initializeServer = (server) => {
  //socket.io config
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    socket.on('userOnline', ({ userId }) => {
      socket.userId = userId;
      onlineUsers.add(userId);
      io.emit('userStatus', Array.from(onlineUsers));
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('userStatus', Array.from(onlineUsers));
      }
    });

    //handle events
    socket.on('joinChat', ({ firstName, userId, targetUserId, token }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      try {
        //socket authentication -> verify jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded._id !== userId) {
          return socket.emit('message_response', {
            success: false,
            error: 'Invalid token!,Please login',
          });
        }
        console.log(firstName + ' Joining Room ' + roomId);
        socket.join(roomId);
      } catch (error) {
        console.error(error.message);
      }
    });

    socket.on(
      'sendMessage',
      async ({ firstName, lastName, userId, targetUserId, newMessages }) => {
        try {
          //check if userId & targetUserId are friend
          const existingConnection = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: 'accepted',
              },
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: 'accepted',
              },
            ],
          });

          // If not connected to user, reject the message
          if (!existingConnection) {
            socket.emit('message_response', {
              success: false,
              error: 'You must be connected with the user to send messages',
            });
            return;
          }
          //create unnique room ID
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + ' ' + newMessages);

          //guard clause for empty msg
          if (!newMessages.trim() || !socket.connected) return;

          //Save message to database
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text: newMessages,
          });
          await chat.save();

          io.to(roomId).emit('messageReceived', {
            firstName,
            lastName,
            newMessages,
          });
        } catch (error) {
          console.error(error.message);
        }
      }
    );
  });
};

module.exports = initializeServer;
