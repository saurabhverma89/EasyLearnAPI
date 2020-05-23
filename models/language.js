const mongoose = require('mongoose')

const languageSchema = new mongoose.Schema({
    LanguageName: {
        type: String,
        required: true
    },
    LanguageCode: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Language', languageSchema, 'Language')