const express = require('express')
const router = express.Router()
const Word = require('../models/word')

router.get('/', async (req, res) => {
    try{
        const words =  await Word.find()
        res.json(words)
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
})

module.exports = router