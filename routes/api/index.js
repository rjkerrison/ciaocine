const router = require('express').Router()
const authRouter = require('./auth.routes')
const moviesRouter = require('./movies.routes')
const showtimesRouter = require('./showtimes.routes')
const cinemasRouter = require('./cinemas.routes')

router.use('/auth', authRouter)
router.use('/movies', moviesRouter)
router.use('/showtimes', showtimesRouter)
router.use('/cinemas', cinemasRouter)

router.use((req, res, next) => {
  // 404 for API
  return res
    .status(404)
    .json({ errorMessage: `Cannot ${req.method} ${req.url}` })
})

router.use((error, req, res, next) => {
  console.error('ERROR: ', req.method, req.path, error)

  // Error handling for API
  return res.status(500).json({ errorMessage: error.message })
})

module.exports = router
