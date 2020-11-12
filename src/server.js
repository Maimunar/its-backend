require('dotenv').config()
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import routes from './routes'

const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const app = express()

//Database Connection
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err) console.log(err)
  console.log(`Succesfully connected mongodb on URL ${DB_URL}`)
})

//Middleware
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())

//Test Method - Delete later
app.get('/', (req,res) => {
  res.status(200).send("Hello World")
})

//Send to router
app.use('/api', routes())

app.listen(PORT,
  () => console.log(`Listening on port ${PORT}`))
