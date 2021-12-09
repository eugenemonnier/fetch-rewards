const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Routes
const rewardRouter = require('./routes/rewardRoutes')
app.use(rewardRouter)

//Error Handling
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)
const notFound = require('./middleware/404')
app.use(notFound)

module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}.`)
    })
  }
}