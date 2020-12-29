require('dotenv').config()
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import routes from './routes'
import session from 'express-session'
import auth from './util/auth'
import ItemsController from './controllers/ItemsController'
import ItemPictureController from './controllers/services/ItemPictureController'
import cors from 'cors'

// const MongoStore = require('connect-mongo')(session);
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const app = express()
const itemPictures = new ItemPictureController(path.join(__dirname, '../public/itemPictures'),)
const itemsController = new ItemsController();

//Sockets setup and saved to local
const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.locals.io = io

//Database Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(err)
  console.log(`Succesfully connected mongodb on URL ${DB_URL}`)
})

io.on('connection', (socket) => console.log('user connected, total:', socket.client.conn.server.clientsCount))
io.on('send-message', message => { console.log('kur')
 io.emit('message', message)})
//Middleware


//Cors is the library that deals with cross-site forgery

// const corsOptions = {
//   origin: 'http://localhost:3000',
// }

// app.use(cors(corsOptions))

//This sets up the session with a store that we use globally
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   name: 'sessionId',
//   proxy: true,
//   cookie: { secure: true },
//   resave: true,
//   saveUninitialized: false,
//   store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));

//Proxy for CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

//Authorisation setup - passport
// app.use(auth.initialize);
// app.use(auth.session);
// app.use(auth.setUser);



app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//Send to router
app.use('/api', routes({ itemsController, itemPictures }))

server.listen(PORT,
  () => console.log(`Listening on port ${PORT}`))
