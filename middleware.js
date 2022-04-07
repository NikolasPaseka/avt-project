const { Event } = require('./models/event')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You have to sign in')
        return res.redirect('/login')
    }
    next()
}

module.exports.isEventAuthor = async (req, res, next) => {
    const { id } = req.params
    const event = await Event.findById(id)
    console.log(event)
    if (!event.organiser.equals(req.user._id)) {
        req.flash('error', 'You dont have permissions to do that')
        return res.redirect(`/events/${id}`)
    }
    next()
}