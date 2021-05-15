const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Translation = require('../models/translation')
const Word = require('../models/word')
const Language = require('../models/language')

router.get('/:categoryid/:sourceLanguageId/:destLanguageId/:selectedLanguageId', async (req, res) => {
    const categoryId = req.params.categoryid
    const sourceLanguageId = req.params.sourceLanguageId
    const destLanguageId = req.params.destLanguageId
    const selectedLanguageId = req.params.selectedLanguageId

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
        await Language.findOne({ "_id" : selectedLanguageId}).then(async language => {
            if(language != null){
            }else{
                return res.status(404).json({message : 'Cannot find selected language'})
            }
        })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    try{
        await Language.findOne({ "_id" : sourceLanguageId}).then(async language => {
            if(language != null){
                result.SearchCriteria.SourceLanguageId = language._id
                result.SearchCriteria.SourceLanguage = language.LanguageName
                result.SearchCriteria.SourceLanguageCode = language.LanguageCode
                const rg = new RegExp("^" + language.LanguageName + "$", "i")
                const word = await Word.findOne({WordText: rg})
                if(word == null){
                    return res.status(404).json({message : 'Cannot find source language in words list'})
                }
                const t = await Translation.findOne({ "WordId" : word._id, "LanguageId" : selectedLanguageId })
                if(t != null){
                    result.SearchCriteria.SourceLanguageTrans = t.Text
                }else{
                    return res.status(404).json({message : 'Cannot find translation of source language'})
                }
            }else{
                return res.status(404).json({message : 'Cannot find Source Language'})
            }
        })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    try{
        await Language.findOne({ "_id" : destLanguageId}).then(async language => {
            if(language != null){
                result.SearchCriteria.DestLanguageId = language._id
                result.SearchCriteria.DestLanguage = language.LanguageName
                result.SearchCriteria.DestLanguageCode = language.LanguageCode
                const rg = new RegExp("^" + language.LanguageName + "$", "i")
                const word = await Word.findOne({WordText: rg})
                if(word == null){
                    return res.status(404).json({message : 'Cannot find destination language in words list'})
                }
                const t = await Translation.findOne({ "WordId" : word._id, "LanguageId" : selectedLanguageId })
                if(t != null){
                    result.SearchCriteria.DestLanguageTrans = t.Text
                }else{
                    return res.status(404).json({message : 'Cannot find translation of destination language'})
                }
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

                await Translation.find({ "WordId" : word._id, "LanguageId" : selectedLanguageId }).then(t => {
                    if(t != null && t.length > 0){
                        row.Selected = t[0].Text
                    }else{
                        row.Selected = ''
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

router.post('/:destLanguageId', async (req, res) => {
    try{
        let translations = {}
        translations.words = []
        
        const lang = await Language.findById(req.params.destLanguageId)
        if(lang != null){
            translations.searchCriteria = {
                "LanguageId" : lang._id,
                "LanguageName": lang.LanguageName
            }
        }else{
            throw {message: "Destination language not found"}
        }

        const words = req.body.words
        for(let i =0; i < words.length; i++){
            const w = words[i]
            const rg = new RegExp("^" + w + "$", "i")
            const word = await Word.findOne({WordText: rg})
            //console.log(w)
            let t = ''
            if(word != null){
                const trans = await Translation.findOne({ "WordId" : word._id, "LanguageId" : req.params.destLanguageId })
                //console.log(trans)
                if(trans != null){
                    t = trans.Text
                }
            }
            translations.words.push({
                word: w,
                translation: t
            })
        }
        res.json(translations)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

module.exports = router