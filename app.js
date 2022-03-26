const express = require('express')
const app = express()

const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')

const { Event } = require('./models/event')

mongoose.connect('mongodb://localhost:27017/joinMe')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch((err) => {
        console.log(`err: ${err}`)
    })

// setup view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/events', async (req, res) => {
    const events = await Event.find({})
    res.render('events/index', { events })
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})