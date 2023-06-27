const User = require('../models/user')

exports.getUserLeaderBoard = async(req, res, next) => {
    try {
      const leaderBoardOfUsers = await User.find()
        .sort([['totalExpenses', 'desc']])
      res.status(200).json(leaderBoardOfUsers)
    } catch (err) {
        res.status(500).json(err)
    }
}