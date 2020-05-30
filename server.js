if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}) 
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

const languageRouter = require('./routes/language')
const categoryRouter = require('./routes/category')
const wordRouter = require('./routes/word')
const translationRouter = require('./routes/translation')

app.use('/language', languageRouter)
app.use('/category', categoryRouter)
app.use('/word', wordRouter)
app.use('/translation', translationRouter)

app.listen(3001, () => console.log('server started')) 