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

const MongoStore = require('connect-mongo')(session);
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const app = express()
const itemPictures = new ItemPictureController(path.join(__dirname, '../public/itemPictures'),)
const itemsController = new ItemsController();
//Database Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(err)
  console.log(`Succesfully connected mongodb on URL ${DB_URL}`)
})

//Middleware

//This sets up the session with a store that we use globally
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  proxy: true,
  cookie: { secure: true },
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Authorisation setup - passport
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())

//Test Method - Delete later
app.get('/', (req, res) => {
  res.status(200).send("Hello World")
})

//Send to router
app.use('/api', routes({ itemsController, itemPictures }))

app.listen(PORT,
  () => console.log(`Listening on port ${PORT}`))
