const { getDateParams } = require('./helpers/dates')
const { getMovies, getUrls } = require('./helpers/movies')

const router = require('express').Router()

/* GET movies */
router.get('/', async (req, res, next) => {
  try {
    const { fromDate, toDate } = getDateParams(req.query)

    const movies = await getMovies({ fromDate, toDate, ...req.query })

    res.render('movies', {
      movies,
      pageTitle: `What's On`,
      chosenDate: fromDate,
      ...getUrls({ ...req.query, date: fromDate }),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
