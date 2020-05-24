const mongoose = require('mongoose')
const validations = require('./validations')
const schema = mongoose.Schema

const wordSchema = new schema({
    CategoryId: {
        type: schema.ObjectId,
        required: true,
        ref: 'Category',
        validate:[{
            validator: v => ifCategoryIdExists(v),
            message: 'Category does not exists'
        }]
    },
    WordText: {
        type: String,
        required: true,
        validate: [{
            validator: v => validations.maxLengthValidator(v, 20),
            message: props => `${props.path} exceeds maximum length (${props.value.length}/20)`
        }]
    }
})

async function ifCategoryIdExists(categoryid) {
    const result = await mongoose.models['Category'].findById(categoryid)
    if(result == null){
        return false
    }else{
        return true
    }
}


module.exports = mongoose.model('Word', wordSchema, 'Word')