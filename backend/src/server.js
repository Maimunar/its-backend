require('dotenv').config()
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import routes from './routes'
import ItemsController from './controllers/ItemsController'
import ItemPictureController from './controllers/services/ItemPictureController'
import { model } from './models/ItemModel'

/*
  Main server file using express
  Uses mongoose for the database and body-parser for request formatting
  PORT and DB_URL are saved in the .env file
  .env is in the .gitignore, if there is an error, please check the readme file
*/
const PORT = process.env.PORT || 8000
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/its3-project'
const app = express()
const itemPictures = new ItemPictureController(path.join(__dirname, '../public/itemPictures'),)
const itemsController = new ItemsController();

/*
  Sockets logic
  They are created here and then saved to the locals directory
  As they are used throughout the file
*/
const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.locals.io = io

/*
  Database Connection
  Mongoose is used to connect to mongodb
*/
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(err)
  else console.log(`Succesfully connected mongodb on URL ${DB_URL}`)
})

io.on('connection', (socket) => console.log('user connected, total:', socket.client.conn.server.clientsCount))

/*
  Middleware - handling of static pictures and bodyParser
*/
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/*
  Send the request to the router
*/
app.use('/api', routes({ itemsController, itemPictures }))

server.listen(PORT,
  () => console.log(`Listening on port ${PORT}`))

module.exports = app;