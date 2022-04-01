module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log('you have to sign in') //TODO flash
        return res.redirect('/login')
    }
    next()
}