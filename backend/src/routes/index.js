const express = require('express')
const router = express.Router()
const usersRoute = require('./users')
const itemsRoute = require('./items/index.js')
const wishlistRoute = require('./wishlist')
const messagesRoute = require('./messages')

/*
  Main router that divides the routes to their specific routers with own controllers
*/
module.exports = (params) => {

  router.use('/users', usersRoute(params))
  router.use('/items', itemsRoute(params))
  router.use('/wishlist', wishlistRoute(params))
  router.use('/messages', messagesRoute(params))
  return router
}
