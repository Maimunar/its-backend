require('dotenv').config()
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

const PORT = process.env.PORT
const app = express()

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())

app.get('/', (req,res) => {
  res.status(200).send("Hello World")
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
