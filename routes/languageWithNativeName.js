const express = require('express')
const router = express.Router()
const Language = require('../models/language')
const Translation = require('../models/translation')
const LanguageWithNativeName = require('../models/languageWithNativeName')
const Word = require('../models/word')

router.get('/', async (req, res) => {
    try{
        const languages =  await Language.find().sort( { LanguageName: 1 } )
        let languageWithNativeNames = []
        let nativeName = ''
        for(let i=0; i< languages.length; i++){
            let l = languages[i]
            const rg = new RegExp("^" + l.LanguageName + "$", "i")
            const word = await Word.findOne({WordText: rg})
            if(word == null){
                return res.status(404).json({message : 'Cannot find language in words list'})
            }
            const t = await Translation.findOne({ "WordId" : word._id, "LanguageId" : l._id })
            if(t != null){
                nativeName = t.Text
            }else{
                return res.status(404).json({message : 'Cannot find translation of language'})
            }
            let languageWithNativeName = new LanguageWithNativeName(l.LanguageCode, l.LanguageName, nativeName)
            languageWithNativeNames.push(languageWithNativeName)
        }
        res.json(languageWithNativeNames)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router