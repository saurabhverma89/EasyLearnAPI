const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const word = require('../models/word')
const translation = require('../models/translation')

router.get('/', async (req, res) => {
    try{
        const category =  await Category.find().sort( { CategoryName: 1 } )
        res.json(category)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getCategory, async (req, res) => {
    res.json(res.category)
})

router.post('/', ifCategoryNameExists(false), async (req, res) => {
    const category = new Category({
        CategoryName : req.body.CategoryName
    })
    try{
        const newCategory = await category.save()
        res.status(201).json(newCategory)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', ifCategoryNameExists(true), getCategory, async (req, res) => {
    if(req.body.CategoryName != null){
        res.category.CategoryName = req.body.CategoryName
    }
    try{
        const updatedCategory = await res.category.save()
        res.json(updatedCategory)
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getCategory, async (req, res) => {
    try{
        const words = await word.find({"CategoryId": req.params.id}, {_id: 1})
        await translation.deleteMany({ "WordId": {$in : words} })
        await word.deleteMany({ "CategoryId": req.params.id})
        await res.category.remove()
        res.json({message: 'Deleted Category'})
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
})

async function getCategory(req, res, next){
    let category
    try{
        category = await Category.findById(req.params.id)
        if(category == null){
            return res.status(404).json({message : 'Cannot find Category'})
        }
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }

    res.category = category
    next()
}

function ifCategoryNameExists(checkIfIdNotExsits){
    return async function(req, res, next){
        try{
            let result
            const rg = new RegExp("^" + req.body.CategoryName + "$", "i")

            if(checkIfIdNotExsits){
                result =  await Category.findOne({CategoryName: rg, _id: { $ne: req.params.id }})
            }else{
                result =  await Category.findOne({CategoryName: rg })
            }
            if(result){
                return res.status(409).json({message: 'Category Name already exists'})
            }
        }
        catch(err){
            res.status(500).json({message : err.message})
        }
        next()
    }
}

module.exports = router