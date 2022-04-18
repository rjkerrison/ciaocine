const { getDateParams } = require('../helpers/dates')
const { getMovies, getFilters } = require('../helpers/movies')

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
      filters: getFilters({
        ...req.query,
      }),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
