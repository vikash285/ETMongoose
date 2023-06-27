const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.authenticate = async(req, res, next) => {
    try {

        const header = req.header('Authorization')
        const token = jwt.verify(header, `${process.env.TOKEN_SECRET}`)

        const user = await User.findById(token.userId)
        req.user = user
        next()
    } catch (err) {
       return res.status(401).json({ success: false })
    }
}