const express = require('express')
const rewardRouter = express.Router()

const Reward = require('../models/rewards')

rewardRouter.post('/spend', async (req, res, next) => {
  let spend = req.body.points
  const rewards = await Reward.find().sort({"timestamp" : 1})
  let pointsSpent = rewards.reduce((result, {payer}) => {
    if (!result[payer]) result[payer] = 0
    return result;
  }, {})
  let i = 0
  while (spend > 0) {
    if (spend >= rewards[i].points) {
      pointsSpent[rewards[i].payer] -= rewards[i].points
      await Reward.updateOne({"_id" : rewards[i]._id}, {"points" : 0})
      spend -= rewards[i].points
      i += 1
    } else {
      pointsSpent[rewards[i].payer] -= spend
      await Reward.updateOne({"_id" : rewards[i]._id}, {"points" : (rewards[i].points - spend)})
      spend = 0
    }
  }
  res.status(202).json(pointsSpent)
})

rewardRouter.post('/create', async (req, res, next) => {
  const reward = new Reward(req.body)
  if (reward.points < 0) {
    const entry = await Reward.find({ "payer" : reward.payer}).sort({ "timestamp" : 1}).limit(1)
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