const {
  getMoviesBetweenTimes,
} = require('../db/aggregations/movies-showing-by-date')
const router = require('express').Router()

const getDateHour = (d, hour) => {
  const date = new Date(d)
  date.setHours(hour)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

/* GET movies */
router.get('/', async (req, res, next) => {
  const { fromHour = 0, toHour = 24, date } = req.query
  const fromDate = getDateHour(date, fromHour)
  const toDate = getDateHour(date, toHour)

  const movies = await getMoviesBetweenTimes(fromDate, toDate)

  res.render('movies', {
    movies,
    pageTitle: 'Movies for date',
    chosenDate: fromDate,
    previousDate: new Date(date).setDate(fromDate.getDate() - 1),
    nextDate: new Date(date).setDate(toDate.getDate() + 1),
  })
})

module.exports = router
