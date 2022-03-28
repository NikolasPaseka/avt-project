const express = require('express')
const app = express()

const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const events = require('./routes/events')
const comments = require('./routes/comments')

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

// routes
app.use('/events', events)
app.use('/events/:id/comments', comments)

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