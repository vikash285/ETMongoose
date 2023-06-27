const express = require('express')
const premiumFeatureController = require('../controllers/premiumFeature')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/showLeaderBoard', authMiddleware.authenticate, premiumFeatureController.getUserLeaderBoard)

module.exports = router