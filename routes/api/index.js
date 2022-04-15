const router = require('express').Router()
const authRouter = require('./auth.routes')
const moviesRouter = require('./movies.routes')
const showtimesRouter = require('./showtimes.routes')

router.use('/auth', authRouter)
router.use('/movies', moviesRouter)
router.use('/showtimes', showtimesRouter)

module.exports = router
