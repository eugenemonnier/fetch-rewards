const express = require('express')
const rewardRouter = express.Router()

const Reward = require('../models/rewards')

rewardRouter.post('/create', async (req, res, next) => {
  const reward = new Reward(req.body)
  reward.save()
  .then(result => res.status(200).json({reward}))
  .catch(next)
})

module.exports = rewardRouter