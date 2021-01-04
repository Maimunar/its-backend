const MessageModel = require("../models/MessageModel");

/*
  Sends all messages or a status 500 if there was an error
*/
exports.getMessages = (req, res) => {
  MessageModel.find({}, (err, messages) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error in finding messages')
    }
    res.send(messages)
  })
}

/*
  Saves a message to the database
  Also emits that message to all frontend sockets
*/
exports.postMessage = async (req, res) => {
  try {
    var message = new MessageModel(req.body)
    var savedMessage = await message.save()
    const io = req.app.locals.io
    if (savedMessage) {
      io.emit('message', req.body)
      res.send(savedMessage)
    }
  } catch (err) {
    res.sendStatus(500).send('Message Post unsuccesful')
  }
}
