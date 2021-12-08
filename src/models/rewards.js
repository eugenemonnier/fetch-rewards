const mongoose = require('mongoose')

const entry = mongoose.Schema({
  companyName: {type: String, required: true},
  amount: {type: Number, required: true},
  dateTime: {type: Date, required: true},
})

module.exports = mongoose.model('entry', entry)