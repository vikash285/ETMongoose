const mongoose = require('mongoose')

const Schema = mongoose.Schema

const forgotPasswordSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    expiresby: {
        type: Date
    },
    userId: {
        type: String, ref: 'User'
    }
})

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);