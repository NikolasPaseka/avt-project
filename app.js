const express = require('express')
const app = express()

const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const eventRoutes = require('./routes/events')
const commentRoutes = require('./routes/comments')
const userRoutes = require('./routes/users')

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

// setup express session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// setup PassPort
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) =>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/', (req, res) => {
    res.render('home')
})

// routes
app.use('/events', eventRoutes)
app.use('/events/:id/comments', commentRoutes)
app.use('/', userRoutes)

app.all('*', (req, res, next) => {
   next(new ExpressError(404, 'Page Not Found!'))
})

// error handler middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) { err.message = 'Oh something went wrong!' }
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})