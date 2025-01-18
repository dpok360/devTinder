const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');
const ConnectionRequest = require('../models/connectionRequest');

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('_'))
    .digest('hex');
};

const initializeServer = (server) => {
  //socket.io config
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });
  io.on('connection', (socket) => {
    //handle events
    socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + ' Joining Room ' + roomId);
      socket.join(roomId);
    });

    socket.on(
      'sendMessage',
      async ({ firstName, lastName, userId, targetUserId, newMessages }) => {
        //TODO: socket authentication -> verify jwt

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

          // If not connected, reject the message
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
    socket.on('disconnect', () => {});
  });
};

module.exports = initializeServer;
