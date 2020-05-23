const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    CategoryId: {
        type: Object,
        required: true
    },
    WordText: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Word', wordSchema, 'Word')