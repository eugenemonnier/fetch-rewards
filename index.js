require('dotenv').config()

const {PORT, MONGODB_URI} = process.env
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connect(MONGODB_URI, options).then(() => console.log('Connected to MongoDB.')).catch(e => console.error(`Error: ${e.stack}`))

const app = require('./src/app')
app.start(PORT)