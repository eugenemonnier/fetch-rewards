const express = require('express')
const rewardRouter = express.Router()

const Reward = require('../models/rewards')

rewardRouter.post('/create', async (req, res, next) => {
  const reward = new Reward(req.body)
  reward.save()
  .then(result => res.status(200).json({reward}))
  .catch(next)
})

rewardRouter.get('/balance', async (req, res, next) => {
entries = await Reward.find()
let balance = await entries.reduce((result, {payer, points}) => {
  if (!result[payer]) result[payer] = points
  else result[payer] += points;
  return result;
}, {})

console.log(balance)
res.status(200).json({balance})
})

module.exports = rewardRouter