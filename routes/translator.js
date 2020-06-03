const express = require('express')
const router = express.Router()
const word = require('../models/word')
const translation = require('../models/translation')
const language = require('../models/language')
const tr = require('googletrans').default

router.get('/', async (req, res) => {
    let countFail = 0
    let countSuccess = 0
    try{
        const words = await word.find()
        const languages = await language.find()

        for(let i = 0; i < words.length; i++){
            const w = words[i]
            for(let j = 0; j < languages.length; j++){
                const l = languages[j]
                const t = await translation.findOne({WordId: w['_id'], LanguageId: l['_id']})
                if(t == null){
                    try{
                        const tresult = await tr(w['WordText'], { from : 'en', to: l['LanguageCode']})
                        //console.log(w['WordText'] + ' -> ' + tresult.text)
                        let newTrans = new translation({
                            WordId: w['_id'],
                            LanguageId: l['_id'],
                            Text : tresult.text
                        })
                        await newTrans.save()
                        //console.log('inserted')
                        countSuccess = countSuccess + 1
                    }
                    catch(errTr){
                        countFail = countFail + 1
                    }
                }
            }
        }
        if(countFail == 0){
            res.json({message: `Success- ${countSuccess}, Fail- ${countFail}, Error- No error`})
        }else{
            res.status(500).json({ message: `Success- ${countSuccess}, Fail- ${countFail}, Error- Error in translation` })
        }
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({ message: `Success- ${countSuccess}, Fail- ${countFail}, Error- ${err.message}` })
    }
})

module.exports = router