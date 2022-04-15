const router = require('express').Router()
const moviesRouter = require('./movies.routes')

router.use('/movies', moviesRouter)

module.exports = router
