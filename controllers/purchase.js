const Razorpay = require('razorpay')
const Order = require('../models/orders')
const userController = require('./user')

exports.purchasePremium = async(req, res, next) => {
    try {
       var rzp = new Razorpay ({
        key_id: `${process.env.RAZORPAY_KEY_ID}`,
        key_secret: `${process.env.RAZORPAY_KEY_SECRET}`
       })
       const amount = 2500

       rzp.orders.create({ amount: amount, currency: "INR" }, async(err, order) => {
        if (err) {
            throw new Error(JSON.stringify(err))
        }
        await Order.create({ orderId: order.id, status: 'PENDING', userId: req.user._id })
            return res.status(201).json({ order, key_id: rzp.key_id })

       })
    } catch (err) {
        return res.status(403).json({ message: 'Something went wrong!', success: false })
    }
}

exports.updateTransactionStatus = async(req, res, next) => {
    try {
        const userId = req.user._id
       const { payment_id, order_id } = req.body
       const order = await Order.findOne({ orderId: order_id })
       order.paymentId = payment_id, order.status = 'SUCCESSFUL'
       const Promise1 = await order.save()
       req.user.isPremiumUser = true
       const Promise2 = await req.user.save()
       await Promise.all([ Promise1, Promise2 ])
            return res.status(202).json({ message: 'Transaction successful', success: true, token: userController.generateAccessToken(userId,undefined , true) })
    } catch (err) {
        return res.status(403).json({ message: 'Something went wrong!', success: false })
    }
}