const getShowtimeById = require('../../db/aggregations/showtimes-by-id')
const { getDateParams } = require('../helpers/dates')
const { getMovies, getUrls } = require('../helpers/movies')

const router = require('express').Router()

/* GET /api/showtimes/:year/:month/:date */
router.get('/:year/:month/:date', async (req, res, next) => {
  const { year, month, date } = req.params
  try {
    const { fromDate, toDate } = getDateParams({
      ...req.query,
      date: new Date(year, month - 1, date),
    })

    const movies = await getMovies({ fromDate, toDate, ...req.query })

    res.json({
      movies,
      fromDate,
      toDate,
      ...getUrls({ ...req.query, date: fromDate, url: '/api/showtimes/' }),
    })
  } catch (error) {
    next(error)
  }
})

/* GET /api/showtimes/:showtimeId */
router.get('/:showtimeId', async (req, res, next) => {
  const { showtimeId } = req.params
  try {
    const showtime = await getShowtimeById(showtimeId)
    res.json({ showtime })
  } catch (error) {
    next(error)
  }
})

module.exports = router
