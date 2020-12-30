const MessageModel = require("../models/MessageModel");

exports.getMessages = (req, res, next) => {
  MessageModel.find({}, (err, messages) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error in finding messages')
    }
    res.send(messages)
  })
}

exports.postMessage = async (req, res, next) => {
  try {
    var message = new MessageModel(req.body)
    var savedMessage = await message.save()
    const io = req.app.locals.io
    if (savedMessage) {
      io.emit('message', req.body)
      res.send(savedMessage)
    }
    else
      res.send('Message couldnt be saved')
  } catch (err) {

    console.log(err)
    res.sendStatus(500).send('Message Post unsuccesful')
  }
}
