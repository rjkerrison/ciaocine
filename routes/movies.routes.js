const {
  getMoviesBetweenTimes,
} = require('../db/aggregations/movies-showing-by-date')
const { filterCinemaToUgcIllimite } = require('../db/aggregations/steps')
const { formatDate, dateFormat } = require('../utils/formatDate')
const router = require('express').Router()

const getDateHour = (d, hour) => {
  const date = new Date(d)
  date.setHours(hour)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

const appendSearchParams = (url, params) => {
  for (let [k, v] of Object.entries(params)) {
    if (v) {
      url.searchParams.append(k, v)
    }
  }
  return url
}

const getMovieUrl = (params) => {
  return appendSearchParams(new URL('http://localhost:3000/movies'), {
    ...params,
    date: formatDate(params.date, dateFormat),
  })
}

const adjustDateByDays = (date, days) => {
  const newDate = new Date(date)
  newDate.setDate(date.getDate() + days)
  return newDate
}

const getUrls = (options) => {
  const { date } = options

  const previousDayUrl = getMovieUrl({
    ...options,
    date: adjustDateByDays(date, -1),
  })
  const nextDayUrl = getMovieUrl({
    ...options,
    date: adjustDateByDays(date, 1),
  })
  const afterworkUrl = getMovieUrl({
    ...options,
    fromHour: 18,
  })
  const ugcIllimiteUrl = getMovieUrl({
    ...options,
    ugcIllimiteOnly: true,
  })

  return {
    previousDayUrl,
    afterworkUrl,
    nextDayUrl,
    ugcIllimiteUrl,
  }
}

/* GET movies */
router.get('/', async (req, res, next) => {
  const {
    fromHour = 0,
    toHour = 24,
    date = Date.now(),
    ugcIllimiteOnly = false,
  } = req.query
  const fromDate = getDateHour(date, fromHour)
  const toDate = getDateHour(date, toHour)

  const additionalFilters = []
  if (Boolean(ugcIllimiteOnly)) {
    additionalFilters.push(filterCinemaToUgcIllimite)
  }

  const movies = await getMoviesBetweenTimes(
    fromDate,
    toDate,
    additionalFilters
  )

  res.render('movies', {
    movies,
    pageTitle: 'Movies for date',
    chosenDate: fromDate,
    ...getUrls({ ...req.query, date: fromDate }),
  })
})

module.exports = router
