import { Router } from 'express'
import { getMoviesNear } from '../../db/aggregations/movies-near'
import getShowtimeById from '../../db/aggregations/showtimes-by-id'
import { readGeolocation } from '../../middleware/readGeolocation'
import { getDateParams } from '../helpers/dates'
import { getMovies, getUrls } from '../helpers/movies'

const router = Router()

/* GET /api/showtimes/:year/:month/:date */
router.get('/:year/:month/:date', async (req, res, _next) => {
  const { year, month, date } = req.params

  const { fromDate, toDate } = getDateParams({
    ...req.query,
    date: new Date(Number(year), Number(month) - 1, Number(date)),
  })

  const movies = await getMovies({ fromDate, toDate, ...req.query })

  res.json({
    movies,
    fromDate,
    toDate,
    ...getUrls({ ...req.query, date: fromDate, url: '/api/showtimes/' }),
  })
})

/* GET /api/showtimes/nearby/soon */
router.get('/nearby/soon', readGeolocation, async (req, res, _next) => {
  const fromDate = new Date()
  const minute = fromDate.getMinutes()
  fromDate.setMinutes(minute - 15)

  const toDate = new Date(fromDate)
  toDate.setHours(fromDate.getHours() + 2)

  const { showtimes, cinemas, movies } = await getMoviesNear(
    req.geolocation,
    fromDate,
    toDate
  )

  res.json({ showtimes, cinemas, movies })
})

/* GET /api/showtimes/:showtimeId */
router.get('/:showtimeId', async (req, res, _next) => {
  const { showtimeId } = req.params

  const showtime = await getShowtimeById(showtimeId)
  res.json({ showtime })
})

export default router
