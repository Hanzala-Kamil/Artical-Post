const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', ChatSchema);