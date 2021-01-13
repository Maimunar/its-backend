import express from 'express'
import MessageController from '../../controllers/MessageController'
import { loggedIn } from '../auth.middleware'
const router = express.Router()

module.exports = () => {

  /*
    This route handles chat messages backend logic
    GET request returns a list of all messages
    POST request lets the user post new messages to the chat
  */
  router.route('/')
    .get(loggedIn, MessageController.getMessages)
    .post(loggedIn, MessageController.postMessage)

  return router;
}
