const {
  getMoviesForDate,
} = require('../db/aggregations/movies-showing-by-date')
const router = require('express').Router()

/* GET movies */
router.get('/', async (req, res, next) => {
  const date = req.query.date ? new Date(req.query.date) : new Date()
  const movies = await getMoviesForDate(date)

  res.render('movies', {
    movies,
    pageTitle: 'Movies for date',
    chosenDate: date,
    previousDate: new Date(date).setDate(date.getDate() - 1),
    nextDate: new Date(date).setDate(date.getDate() + 1),
  })
})

module.exports = router
