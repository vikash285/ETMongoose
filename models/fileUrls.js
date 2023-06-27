const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fileUrlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    userId: {
        type: String, ref: 'User', required: true
    }
})

module.exports = mongoose.model('FileUrl', fileUrlSchema)