const express = require('express')
const router = express.Router()
const Word = require('../models/word')
const ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', async (req, res) => {
    try{
        const words =  await Word.find().populate('CategoryId')
        res.json(words)
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
})

router.get('/Category/:id', async (req, res) => {
    try{
        let words
        words =  await Word.find({CategoryId: ObjectId(req.params.id)}).populate('CategoryId')
        if(words == null || words.length == 0){
            return res.status(404).json({message : 'Cannot find Words for given Category'})
        }
        res.json(words)
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getWord, async (req, res) => {
    res.json(res.Word)
})



async function getWord(req, res, next){
    let word
    try{
        word = await Word.findById(req.params.id)
        if(word == null){
            return res.status(404).json({message : 'Cannot find Word'})
        }
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    res.Word = word
    next()
}

module.exports = router