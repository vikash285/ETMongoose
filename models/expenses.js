const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expensesSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: String, ref: 'User', required: true
    }
})

module.exports = mongoose.model('Expenses', expensesSchema)