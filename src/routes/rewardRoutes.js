const express = require('express')
const rewardRouter = express.Router()

const Reward = require('../models/rewards')

rewardRouter.post('/create', async (req, res, next) => {
  const reward = new Reward(req.body)
  if (reward.points < 0) {
    const entry = await Reward.find({ 'payer' : reward.payer}).sort({ "timestamp" : 1}).limit(1)
    await Reward.updateOne({"_id" : entry[0]._id}, {"points": (entry[0].points + reward.points)})
    res.status(202).json({reward})
  }
  else reward.save()
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
  res.status(200).json({balance})
})

module.exports = rewardRouter