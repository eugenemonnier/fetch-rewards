const mongoose = require('mongoose')
// create a database schema containing 3 fields, all of which are required
const rewards = mongoose.Schema({
  payer: {type: String, required: true},
  points: {type: Number, required: true},
  timestamp: {type: Date, required: true},
})

module.exports = mongoose.model('rewards', rewards)