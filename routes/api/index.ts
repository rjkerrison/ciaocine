import { Router } from 'express'
import authRouter from './auth.routes'
import moviesRouter from './movies.routes'
import showtimesRouter from './showtimes.routes'
import cinemasRouter from './cinemas.routes'
import likesRouter from './likes.routes'
import calendarRouter from './calendar.routes'
import metadataRouter from './metadata.routes'

const router = Router()

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

export default router
