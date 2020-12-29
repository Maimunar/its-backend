const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
});



module.exports = mongoose.model('Message', MessageSchema)
