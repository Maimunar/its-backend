const express = require('express')
const router = express.Router()


//Require routes
const usersRoute = require('./users')
const itemsRoute = require('./items')
const wishlistRoute = require('./wishlist')
const messagesRoute = require('./messages')
module.exports = (params) => {

  router.use('/users', usersRoute(params))
  router.use('/items', itemsRoute(params))
  router.use('/wishlist', wishlistRoute(params))
  router.use('/messages', messagesRoute(params))
  return router
}
