const express = require('express')
const mongoose = require('mongoose')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Comment = require('../models/comment')
const { Event } = require('../models/event')

const router = express.Router({ mergeParams: true })

router.post('/', catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    event.comments.push(comment)
    comment.event = event
    comment.user = req.user._id
    await event.save()
    await comment.save()
    res.redirect(`/events/${event._id}`)
}))

module.exports = router
