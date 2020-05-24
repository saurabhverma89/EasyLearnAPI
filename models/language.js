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

async function isEmailExists(languageName) {
    const rg = new RegExp("^" + languageName + "$", "i")
    const result = await mongoose.models['Language'].findOne({ LanguageName: rg })
    if(result){
        return false
    }else{
        return true
    }
}

module.exports = mongoose.model('Language', languageSchema, 'Language')