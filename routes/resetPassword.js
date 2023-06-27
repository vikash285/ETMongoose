const express = require('express');
const resetPasswordController = require('../controllers/resetPassword');
const router = express.Router();

router.get('/resetPassword/:id', resetPasswordController.resetPassword)
router.get('/updatePassword/:resetPasswordId', resetPasswordController.updatePassword)
router.use('/forgotPassword', resetPasswordController.forgotPassword)

module.exports = router;