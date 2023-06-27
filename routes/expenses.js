const path = require('path')
const express = require('express')
const expensesController = require('../controllers/expenses')
const router = express.Router()
const userAuthenticate = require('../middleware/auth')

router.post('/addExpenses', userAuthenticate.authenticate,expensesController.postExpenses)

router.post('/addUrls', userAuthenticate.authenticate, expensesController.postFileUrls)

router.get('/getExpenses', userAuthenticate.authenticate, expensesController.getExpenses)

router.get('/getUrls', userAuthenticate.authenticate, expensesController.getFileUrls)

router.get('/download', userAuthenticate.authenticate, expensesController.downloadExpense)

router.delete('/deleteExpense/:id/:amount', userAuthenticate.authenticate, expensesController.deleteExpense)

module.exports = router