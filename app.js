const express = require('express')
const app = express()

const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const { Event, eventCategories } = require('./models/event')
const Address = require('./models/address')

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

// setup body parser
app.use(express.urlencoded({ extended: true }))

// setup method override
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/events', async (req, res) => {
    const events = await Event.find({})
    res.render('events/index', { events })
})

app.get('/events/new', (req, res) => {
    res.render('events/new', { eventCategories })
})

app.post('/events', async (req, res) => {
    try {
        const address = new Address( req.body.address)
        const event = new Event( req.body.event)
        event.creationDate = Date.now()
        event.address = address
        await address.save()
        await event.save()
        res.redirect(`/events/${event._id}`)
    } catch (err) {
        console.log(err)
    }
})

app.get('/events/:id', async (req, res) => {
    const event = await Event.findById(req.params.id).populate('address')
    res.render('events/show', { event })
})

app.get('/events/:id/edit', async (req, res) => {
    const event = await Event.findById(req.params.id).populate('address')
    res.render('events/edit', { event, eventCategories })
})

app.put('/events/:id', async (req, res) =>{
    try {
        const eventId = req.params.id
        const event = await Event.findByIdAndUpdate(eventId, { ...req.body.event })
        const addressId = event.address._id
        const address = await Address.findByIdAndUpdate(addressId, { ...req.body.address })
        res.redirect(`/events/${event._id}`)
    } catch (err) {
        console.log(err)
    }
})

app.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        const addressId = event.address._id
        const add = await Address.findByIdAndDelete(addressId)
    } catch (err) {
        console.log(err)
    }
    res.redirect('/events')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})