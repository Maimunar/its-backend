import express from 'express'
import userController from '../../controllers/UserController'
const router = express.Router();

module.exports = () => {

  /*
    This route handles user authentication
    '/register' creates a new user model
    '/login' authenticates a user with an already existing model
  */
  router.post('/register', userController.register)
  router.post('/login', userController.login);

  return router;
}