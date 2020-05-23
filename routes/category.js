const express = require('express')
const router = express.Router()
const Category = require('../models/category')

router.get('/', async (req, res) => {
    try{
        const category =  await Category.find()
        res.json(category)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getCategory, async (req, res) => {
    res.json(res.category)
})

router.post('/', async (req, res) => {
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

router.patch('/:id', getCategory, async (req, res) => {
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

module.exports = router