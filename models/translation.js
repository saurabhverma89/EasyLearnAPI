const mongoose = require('mongoose')
const schema = mongoose.Schema

const translationSchema = new schema({
    WordId: {
        type: schema.ObjectId,
        required: true,
        ref: 'Word'
    },
    LanguageId: {
        type: schema.ObjectId,
        required: true,
        ref: 'Language'
     },
    Text: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Translation', translationSchema, 'Translation')