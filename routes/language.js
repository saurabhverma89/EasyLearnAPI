const express = require('express')
const router = express.Router()
const Language = require('../models/language')

router.get('/', async (req, res) => {
    try{
        const languages =  await Language.find()
        res.json(languages)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getLanguage, async (req, res) => {
    res.json(res.language)
})

router.post('/', async (req, res) => {
    const language = new Language({
        LanguageName : req.body.LanguageName,
        LanguageCode : req.body.LanguageCode
    })
    try{
        const newLanguage = await language.save()
        res.status(201).json(newLanguage)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getLanguage, async (req, res) => {
    if(req.body.LanguageName != null){
        res.language.LanguageName = req.body.LanguageName
    }
    if(req.body.LanguageCode != null){
        res.language.LanguageCode = req.body.LanguageCode
    }
    try{
        const updatedLanguage = await res.language.save()
        res.json(updatedLanguage)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getLanguage, async (req, res) => {
    try{
        await res.language.remove()
        res.json({message: 'Deleted Language'})
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
})

async function getLanguage(req, res, next){
    let language
    try{
        language = await Language.findById(req.params.id)
        if(language == null){
            return res.status(404).json({message : 'Cannot find Language'})
        }
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    res.language = language
    next()
}

module.exports = router