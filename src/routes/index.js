const express = require('express')
const router = express.Router()


//Require routes
const usersRoute = require('./users')
const itemsRoute = require('./items')
module.exports = (params) => {

  router.get('/', (request, response) => {
    return response.send('Hello from /api')
  })
  router.use('/users', usersRoute(params))
  router.use('/items', itemsRoute(params))
  return router
}
