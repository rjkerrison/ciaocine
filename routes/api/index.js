const router = require('express').Router()
const authRouter = require('./auth.routes')
const moviesRouter = require('./movies.routes')

router.use('/auth', authRouter)
router.use('/movies', moviesRouter)

module.exports = router
