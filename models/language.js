const mongoose = require('mongoose')
const validations = require('./validations')

const languageSchema = new mongoose.Schema({
    LanguageName: {
        type: String,
        required: true,
        validate: [{
            validator: v => validations.maxLengthValidator(v, 20),
            message: props => `${props.path} exceeds maximum length (${props.value.length}/20)`
        }]
    },
    LanguageCode: {
        type: String,
        required: [true, 'LanguageCode is required'],
        validate: {
            validator: (v) => v.length == 2,
            message: `Invalid value`
        },
    }
})

module.exports = mongoose.model('Language', languageSchema, 'Language')