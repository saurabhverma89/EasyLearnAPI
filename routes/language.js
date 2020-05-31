const express = require('express')
const router = express.Router()
const Language = require('../models/language')
const Translation = require('../models/translation')

router.get('/', async (req, res) => {
    try{
        const languages =  await Language.find().sort( { LanguageName: 1 } )
        res.json(languages)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getLanguage, async (req, res) => {
    res.json(res.language)
})

router.post('/', ifLanguageNameExists(false), ifLanguageCodeExists(false), async (req, res) => {
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

router.patch('/:id', ifLanguageNameExists(true), ifLanguageCodeExists(true), getLanguage, async (req, res) => {
    try{
        if(req.body.LanguageName != null){
            res.language.LanguageName = req.body.LanguageName
        }
        if(req.body.LanguageCode != null){
            res.language.LanguageCode = req.body.LanguageCode
        }
    
        const updatedLanguage = await res.language.save()
        res.json(updatedLanguage)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id/', getLanguage, async (req, res) => {
    try{
        await Translation.deleteMany({ "LanguageId": req.params.id})
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

 function ifLanguageNameExists(checkIfIdNotExsits){
    return async function(req, res, next){
        try{
            let result
            const rg = new RegExp("^" + req.body.LanguageName + "$", "i")

            if(checkIfIdNotExsits){
                result =  await Language.findOne({LanguageName: rg, _id: { $ne: req.params.id }})
            }else{
                result =  await Language.findOne({LanguageName: rg })
            }
            if(result){
                return res.status(409).json({message: 'Language Name already exists'})
            }
        }
        catch(err){
            res.status(500).json({message : err.message})
        }
        next()
    }
}

function ifLanguageCodeExists(checkIfIdNotExsits){
    return async function(req, res, next){
        try{
            let result
            const rg = new RegExp("^" + req.body.LanguageCode + "$", "i")

            if(checkIfIdNotExsits){
                result =  await Language.findOne({LanguageCode: rg, _id: { $ne: req.params.id }})
            }else{
                result =  await Language.findOne({LanguageCode: rg })
            }
            if(result){
                return res.status(409).json({message: 'Language Code already exists'})
            }
        }
        catch(err){
            res.status(500).json({message : err.message})
        }
        next()
    }
}

module.exports = router