const express = require('express')
const router = express.Router()
const Word = require('../models/word')
const translation = require('../models/translation')
const ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', async (req, res) => {
    try{
        const words =  await Word.find().populate('CategoryId').sort( { WordText: 1 } )
        res.json(words)
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
})

router.get('/Category/:id', async (req, res) => {
    try{
        let words
        words =  await Word.find({CategoryId: ObjectId(req.params.id)}).populate('CategoryId').sort( { WordText: 1 } )
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

router.post('/', ifWordExists(false), async (req, res) => {
    const word = new Word({
        CategoryId: req.body.CategoryId,
        WordText : req.body.WordText
    })
    try{
        const newWord = await word.save()
        res.status(201).json(newWord)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', ifWordExists(true), getWord, async (req, res) => {
    if(req.body.CategoryId != null){
        res.Word.CategoryId = req.body.CategoryId
    }
    if(req.body.WordText != null){
        res.Word.WordText = req.body.WordText
    }
    try{
        const updatedWord = await res.Word.save()
        res.json(updatedWord)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id/', getWord, async (req, res) => {
    try{
        await translation.deleteMany({ "WordId": req.params.id})
        await res.Word.remove()
        res.json({message: 'Deleted Word'})
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
})

async function getWord(req, res, next){
    let word
    try{
        word = await Word.findById(req.params.id).populate('CategoryId')
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

function ifWordExists(checkIfIdNotExsits){
    return async function(req, res, next){
        try{
            let result
            const rg = new RegExp("^" + req.body.WordText + "$", "i")

            if(checkIfIdNotExsits){
                result =  await Word.findOne({WordText: rg, _id: { $ne: req.params.id }})
            }else{
                result =  await Word.findOne({WordText: rg })
            }
            if(result){
                return res.status(409).json({message: 'Word already exists'})
            }
        }
        catch(err){
            res.status(500).json({message : err.message})
        }
        next()
    }
}

module.exports = router