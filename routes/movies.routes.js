const { getMovies, getUrls } = require('./helpers/movies')

const router = require('express').Router()

/* GET movies */
router.get('/', async (req, res, next) => {
  try {
    const { movies, fromDate } = await getMovies(req.query)

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
