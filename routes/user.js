const path = require('path')
const express = require('express')
const userController = require('../controllers/user')
const router = express.Router()

router.post('/signUP', userController.postSignUp)

router.post('/login', userController.postLogin)

module.exports = router