const router = require('express').Router()
const authRouter = require('./auth.routes')
const moviesRouter = require('./movies.routes')
const showtimesRouter = require('./showtimes.routes')
const cinemasRouter = require('./cinemas.routes')
const likesRouter = require('./likes.routes')
const calendarRouter = require('./calendar.routes')
const metadataRouter = require('./metadata.routes')

router.use('/auth', authRouter)
router.use('/movies', moviesRouter)
router.use('/showtimes', showtimesRouter)
router.use('/cinemas', cinemasRouter)
router.use('/likes', likesRouter)
router.use('/calendar', calendarRouter)
router.use('/metadata', metadataRouter)
router.get('/healthz', (_req, res, _next) => {
  res.send('Ciaocine is running!')
})

router.use((error, req, res, next) => {
  console.error('ERROR: ', req.method, req.path, error)
  if (error.status === 401) {
    return res.status(401).json({ errorMessage: error.message })
  }

  console.error('ERROR: ', req.method, req.path, error)

  // Error handling for API
  return res.status(500).json({ errorMessage: error.message })
})

module.exports = router
