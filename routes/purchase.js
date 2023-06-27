const path = require('path')
const express = require('express')
const purchaseController = require('../controllers/purchase')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/premiumMemberShip', authMiddleware.authenticate, purchaseController.purchasePremium)

router.post('/updateTransactionStatus', authMiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router