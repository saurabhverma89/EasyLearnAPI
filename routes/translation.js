const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Translation = require('../models/translation')
const Word = require('../models/word')
const Language = require('../models/language')

router.get('/:categoryid/:sourceLanguageId/:destLanguageId', async (req, res) => {
    const categoryId = req.params.categoryid
    const sourceLanguageId = req.params.sourceLanguageId
    const destLanguageId = req.params.destLanguageId

    let result = {}
    result.SearchCriteria = {}
    result.Translations = []
    
    try{
        await Category.findOne({ "_id" : categoryId}).then(category => {
            if(category != null){
                result.SearchCriteria.Category = category.CategoryName
            }else{
                return res.status(404).json({message : 'Cannot find Category'})
            }
        })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    try{
        await Language.findOne({ "_id" : sourceLanguageId}).then(language => {
            if(language != null){
                result.SearchCriteria.SourceLanguage = language.LanguageName
                result.SearchCriteria.SourceLanguageCode = language.LanguageCode
            }else{
                return res.status(404).json({message : 'Cannot find Source Language'})
            }
        })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    try{
        await Language.findOne({ "_id" : destLanguageId}).then(language => {
            if(language != null){
                result.SearchCriteria.DestLanguage = language.LanguageName
                result.SearchCriteria.DestLanguageCode = language.LanguageCode
            }
            else{
                return res.status(404).json({message : 'Cannot find Destination Language'})
            }
        })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    try{
        await Word.find({ "CategoryId" : categoryId }).then(async words => {
            for(let i = 0; i < words.length; i++){
                const word = words[i] 
                let row = {}
                row.Word = word.WordText
                
                await Translation.find({ "WordId" : word._id, "LanguageId" : sourceLanguageId }).then(t => {
                    if(t != null && t.length > 0){
                        row.Source = t[0].Text
                    }else{
                        row.Source = ''
                    }
                })

                await Translation.find({ "WordId" : word._id, "LanguageId" : destLanguageId }).then(t => {
                    if(t != null && t.length > 0){
                        row.Dest = t[0].Text
                    }else{
                        row.Dest = ''
                    }
                })

                if(row.Source != '' && row.Dest != ''){
                    result.Translations.push(row)
                }
            }
      })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    res.json(result)
})

module.exports = router