// dependencies
require('dotenv').config()
const mongoose = require('mongoose')

// keep environmental variables hidden in .env file
const {PORT, MONGODB_URI} = process.env

// options for MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// connect app with MongoDB
mongoose.connect(MONGODB_URI, options).then(() => console.log('Connected to MongoDB.')).catch(e => console.error(`Error: ${e.stack}`))

// import node app and start it on port specified in env
const app = require('./src/app')
app.start(PORT)