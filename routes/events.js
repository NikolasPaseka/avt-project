const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isEventAuthor } = require('../middleware')

const { Event, eventCategories } = require('../models/event')
const Address = require('../models/address')
const Comment = require('../models/comment')

router.get('/', catchAsync(async (req, res) => {
    const events = await Event.find({}).populate('address')
    res.render('events/index', { events })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('events/new', { eventCategories })
})

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const address = new Address(req.body.address)
    const event = new Event(req.body.event)
    event.creationDate = Date.now()
    event.address = address
    event.organiser = req.user._id
    await address.save()
    await event.save()
    res.redirect(`/events/${event._id}`)
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id)
        .populate('address')
        .populate('organiser')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
    if (!event) {
        return next(new ExpressError(404, 'Event not found'))
    }
    res.render('events/show', { event })
}))

router.get('/:id/edit', isLoggedIn, isEventAuthor, catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('address')
    res.render('events/edit', { event, eventCategories })
}))

router.put('/:id', isLoggedIn, isEventAuthor, catchAsync(async (req, res) =>{
    const eventId = req.params.id
    const event = await Event.findByIdAndUpdate(eventId, { ...req.body.event })
    const addressId = event.address._id
    const address = await Address.findByIdAndUpdate(addressId, { ...req.body.address })
    req.flash('success', 'Event succesfully updated')
    res.redirect(`/events/${event._id}`)
}))

router.delete('/:id', isLoggedIn, isEventAuthor, catchAsync(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id)
    const addressId = event.address._id
    const add = await Address.findByIdAndDelete(addressId)
    req.flash('success', 'Event succesfully deleted')
    res.redirect('/events')
}))

module.exports = router