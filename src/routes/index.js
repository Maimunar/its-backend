const express = require('express')
const router = express.Router()

module.exports = () => {

  router.get('/', (request, response) => {
    return response.send('Hello from /api')
  })

  return router
}