const Expenses = require('../models/expenses')
const FileUrl = require('../models/fileUrls')
const S3Services = require('../services/s3Services')

function isStringInvalid (string) {
    if (string === undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}

const postExpenses = async(req, res, next) => {
    try {
        const { amount, description, category } = req.body
        if (isStringInvalid(amount) || isStringInvalid(description) || isStringInvalid(category)) {
            return res.status(400).json({ err: 'Bad Parameters, Something is missing.'})
        }
        const data = await Expenses.create({ 
            amount: amount, description: description, category: category, userId: req.user._id
         })
        const totalExpense = Number(req.user.totalExpenses) + Number(amount)

        req.user.totalExpenses = totalExpense
        await req.user.save()
        res.status(201).json({ userExpense: data, message: 'Expense Added!', success: true })
    } catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

const getExpenses = async(req, res, next) => {
    try {
        const ITEMS_PER_PAGE = +req.query.limit || 1
        const page = +req.query.page || 1
        const totalItems = await Expenses.countDocuments()

        const data = await Expenses.find({ userId: req.user._id })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
        return res.status(200).json({
             allExpenses: data,
             currentPage: page,
             hasNextPage: ITEMS_PER_PAGE * page < totalItems,
             nextPage: page + 1,
             hasPreviousPage: page > 1,
             previousPage: page - 1,
             lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
             limit: ITEMS_PER_PAGE
            })
    } catch (err) {
        return res.status(500).json({ message: err, success: false })
    }
}

const deleteExpense = async(req, res, next) => {
    try {
    const eId = req.params.id
    const eAmount = req.params.amount
    
    await Expenses.deleteOne({ _id: eId, userId: req.user._id })
    const totalExpense = Number(req.user.totalExpenses) - Number(eAmount)
    
    req.user.totalExpenses = totalExpense
    await req.user.save()
    return res.sendStatus(200)
    } catch (err) {
       return res.status(500).json({ message: err, success: false })
    }
}

const downloadExpense = async(req, res) => {
    try {
    const expenses = await Expenses.find({ userId: req.user._id })
    const stringifiedExpenses = JSON.stringify(expenses)

    const userId = req.user._id
    const fileName = `Expense${userId}/${new Date()}.txt`
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName)
    res.status(200).json({ fileURL, success: true })
    } catch (err) {
        res.status(500).json({ fileURL: '', success: false, err: err })
    }
}

const postFileUrls = async(req, res) => {
    try{
        const { url } = req.body
         const data = await FileUrl.create({ url: url, userId: req.user._id })
         return res.status(201).json({ fileURL: data, success: true })
    } catch (err) {
        return res.status(500).json({ message: err, success: false })
    }
}

const getFileUrls = async(req, res) => {
    try{
        const url = await FileUrl.find({ userId: req.user._id })
        return res.status(200).json({ allUrls: url })
    } catch (err) {
        return res.status(500).json({ message: err, success: false })
    }
}

module.exports = {
    getExpenses, getFileUrls, postExpenses, postFileUrls, deleteExpense, downloadExpense
}