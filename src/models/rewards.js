const mongoose = require('mongoose')

const rewards = mongoose.Schema({
  payer: {type: String, required: true},
  points: {type: Number, required: true},
  timestamp: {type: Date, required: true},
})

module.exports = mongoose.model('rewards', rewards)