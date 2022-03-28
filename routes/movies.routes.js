const {
  getMoviesBetweenTimes,
} = require('../db/aggregations/movies-showing-by-date')
const { filterCinemaToUgcIllimite } = require('../db/aggregations/steps')
const { APP_URL } = require('../utils/consts')
const {
  formatDate,
  dateFormat,
  weekdayDateMonthFormat,
} = require('../utils/formatDate')
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
  return appendSearchParams(new URL(`${APP_URL}/movies`), {
    ...params,
    date: formatDate(params.date, dateFormat),
  })
}

const adjustDateByDays = (date, days) => {
  const newDate = new Date(date)
  newDate.setDate(date.getDate() + days)
  return newDate
}

const getDaysUrls = (options, step, count) => {
  const dates = []

  for (let i = 1; i <= count; i++) {
    const date = adjustDateByDays(options.date, i * step)
    dates.push(date)
  }

  dates.sort((a, b) => a - b)
  const results = dates.map((date) => {
    const url = getMovieUrl({
      ...options,
      date,
    })
    const label = formatDate(date, weekdayDateMonthFormat)

    return { url, label }
  })
  return results
}

const getUrls = (options) => {
  const afterworkUrl = getMovieUrl({
    ...options,
    fromHour: 18,
  })
  const ugcIllimiteUrl = getMovieUrl({
    ...options,
    ugcIllimiteOnly: true,
  })

  return {
    calendarUrls: [
      ...getDaysUrls(options, -1, 3),
      {
        url: getMovieUrl(options),
        label: formatDate(options.date, weekdayDateMonthFormat),
        class: 'selected',
      },
      ...getDaysUrls(options, 1, 3),
    ],
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
    pageTitle: `Movies showing ${formatDate(fromDate, dateFormat)}`,
    chosenDate: fromDate,
    ...getUrls({ ...req.query, date: fromDate }),
  })
})

module.exports = router
