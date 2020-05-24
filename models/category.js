const mongoose = require('mongoose')
const validations = require('./validations')

const categorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true,
        validate: {
            validator: v => validations.maxLengthValidator(v, 50),
            message: props => `${props.path} exceeds maximum length (${props.value.length}/50)`
        }
    }
})

module.exports = mongoose.model('Category', categorySchema, 'Category')