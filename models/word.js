const mongoose = require('mongoose')
const schema = mongoose.Schema

const wordSchema = new schema({
    CategoryId: {
        type: schema.ObjectId,
        required: true,
        ref: 'Category'
    },
    WordText: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Word', wordSchema, 'Word')