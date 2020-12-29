import express from 'express'
import MessageController from '../../controllers/MessageController'
import { loggedIn } from '../auth.middleware'
const router = express.Router()

module.exports = (params) => {

  router.route('/')
    .get(loggedIn, MessageController.getMessages)
    .post(loggedIn, MessageController.postMessage)

  return router;
}
