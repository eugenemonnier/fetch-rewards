// dependencies
const express = require('express')
const rewardRouter = express.Router()

// import Reward model
const Reward = require('../models/rewards')

// create route to add transactions
rewardRouter.post('/create', async (req, res, next) => {
  const reward = new Reward(req.body)
  // in cases where transaction is a negative amount, it will subtract points from the oldest transaction from that payer
  if (reward.points < 0) {
    // finding oldest transaction from specified payer in the DB
    const entry = await Reward.find({ "payer" : reward.payer}).sort({ "timestamp" : 1}).limit(1)
    // update found transaction's point, subtracting the new transaction from them
    await Reward.updateOne({"_id" : entry[0]._id}, {"points": (entry[0].points + reward.points)})
    res.status(202).json({reward})
  }
  // otherwise if points value is positive, save new entry to DB
  else reward.save()
  .then(result => res.status(200).json({reward}))
  .catch(next)
})

// balance route to retrieve total points for each payer
rewardRouter.get('/balance', async (req, res, next) => {
  // collect all entries from DB
  entries = await Reward.find()
  // reduce entries to an object containing payers as keys and points as values
  let balance = await entries.reduce((result, {payer, points}) => {
    if (!result[payer]) result[payer] = points
    else result[payer] += points;
    return result;
  }, {})
  // sends status message containing balance object as json
  res.status(200).json({balance})
})

// spend route to subtract points from entries in order of oldest to newest
rewardRouter.post('/spend', async (req, res, next) => {
  // store points from request message into a variable
  let spend = req.body.points
  // retrieve all entries in order of oldest to newest
  const rewards = await Reward.find().sort({"timestamp" : 1})
  // use rewards to create object where keys=payer & val=0
  let pointsSpent = rewards.reduce((result, {payer}) => {
    if (!result[payer]) result[payer] = 0
    return result;
  }, {})
  // create counter
  let i = 0
  // loop while spend points > 0
  while (spend > 0) {
    // check if spend amount is greater than current entry's points
    if (spend >= rewards[i].points) {
      // subtract current entry points from running total of points for this spend for that payer 
      pointsSpent[rewards[i].payer] -= rewards[i].points
      // subtract current entries points from spend total
      spend -= rewards[i].points
      // update that entry in DB and set points to 0
      await Reward.updateOne({"_id" : rewards[i]._id}, {"points" : 0})
      // increment counter
      i += 1
    } else {
      // otherwise if spend is less than current entry points 
      // subtract spend from running total of points for this spend for that payer
      pointsSpent[rewards[i].payer] -= spend
      // update current entry in DB and set points to it's current point value minus spend
      await Reward.updateOne({"_id" : rewards[i]._id}, {"points" : (rewards[i].points - spend)})
      // set spend to 0 to end the loop, could also forcibly break the loop
      spend = 0
    }
  }
  // respond with status message and json containing pointsSpent data
  res.status(202).json(pointsSpent)
})

module.exports = rewardRouter