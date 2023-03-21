import { Router } from 'express'
import { getMovies } from '../helpers/movies'
import { getDateParams } from '../helpers/dates'
import Cinema from '../../models/Cinema.model'
import { readGeolocation } from '../../middleware/readGeolocation'

const router = Router()

/* GET /api/cinemas */
router.get('/', async (_req, res, _next) => {
  const cinemas = await Cinema.find()
  res.status(200).json({ cinemas })
})

const twoKm = 2000

/* GET /api/cinemas */
router.get('/nearby', readGeolocation, async (req, res, _next) => {
  const cinemas = await Cinema.find({
    geolocation: {
      $near: { $geometry: req.geolocation, $maxDistance: twoKm },
    },
  })
  res.status(200).json({ cinemas })
})

/* GET /api/cinemas/:cinemaId */
router.get('/:cinemaIdOrSlug', async (req, res, _next) => {
  const { fromDate, toDate } = getDateParams(req.query)

  const cinema = await Cinema.findBySlugOrId(req.params.cinemaIdOrSlug)
  if (!cinema) {
    res.status(404).json({
      message: `No cinema matches "${req.params.cinemaIdOrSlug}".`,
    })
    return
  }

  const movies = await getMovies({
    ...req.query,
    cinema: cinema._id,
    fromDate,
    toDate,
  })

  res.status(200).json({
    cinema,
    movies,
  })
})

router.get(
  '/:cinemaIdOrSlug/showtimes/:year/:month/:date',
  async (req, res, _next) => {
    const cinema = await Cinema.findBySlugOrId(req.params.cinemaIdOrSlug)

    const { year, month, date } = req.params

    const { fromDate, toDate } = getDateParams({
      ...req.query,
      date: new Date(Number(year), Number(month) - 1, Number(date)),
    })

    const movies = await getMovies({
      fromDate,
      toDate,
      cinema: cinema._id,
      ...req.query,
    })

    res.json({
      cinema,
      movies,
      fromDate,
      toDate,
    })
  }
)

export default router
