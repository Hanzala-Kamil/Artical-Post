const mongoose = require('mongoose');
const Chat = require('../model/chatModel');
const User = require('../model/authModel');

const socketsMessage = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', async (username) => {
      try {
        const user = await User.findOne({ name: username });
        if (user) {
          socket.join(user._id.toString());
          console.log(`${username} joined room: ${user._id.toString()}`);
        }
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    socket.on('send_message', async (data, cb) => {
      try {
        const sender = await User.findOne({ name: data.sender });
        const receiver = await User.findOne({ name: data.receiver });

        if (!sender || !receiver) {
          return cb({ status: 'error', message: 'Sender or receiver not found' });
        }

        let chat = await Chat.findOne({ username: sender._id });
        if (chat) {
          chat.messages.push({ sender: sender._id, receiver: receiver._id, message: data.text });
        } else {
          chat = new Chat({
            username: sender._id,
            messages: [{ sender: sender._id, receiver: receiver._id, message: data.text }]
          });
        }
        await chat.save();
        io.to(receiver._id.toString()).emit('receive_message', data);
        io.to(sender._id.toString()).emit('receive_message', data);

        cb({ status: 'ok' });
      } catch (error) {
        console.error('Error saving message to database:', error);
        cb({ status: 'error', message: 'Message failed to save' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = socketsMessage;