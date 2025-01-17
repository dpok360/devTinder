const socket = require('socket.io');
const crypto = require('crypto');

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
      ({ firstName, userId, targetUserId, newMessages }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName + ' ' + newMessages);
        io.to(roomId).emit('messageReceived', { firstName, newMessages });
      }
    );

    socket.on('disconnect', () => {});
  });
};

module.exports = initializeServer;
