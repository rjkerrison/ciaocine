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
  const date = new Date(Date.now())
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

const getDaysUrls = (options, step, count, classname) => {
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

    return { url, label, class: classname }
  })
  return results
}

const getHourUrlInfo = (hour, options) => {
  const label = `${hour}h`

  if (hour === Number(options.fromHour)) {
    return {
      url: getMovieUrl({
        ...options,
        fromHour: null,
      }),
      label,
      class: 'selected',
    }
  }

  const url = getMovieUrl({
    ...options,
    fromHour: hour,
  })

  return { url, label }
}

const getHoursUrls = (options) => {
  const hours = [8, 10, 12, 14, 16, 18, 20, 22]
  const results = hours.map((hour) => getHourUrlInfo(hour, options))
  return results
}

const getUrls = (options) => {
  const ugcIllimiteUrl = getMovieUrl({
    ...options,
    // deselection
    ugcIllimiteOnly: !options.ugcIllimiteOnly,
  })

  return {
    calendarUrls: [
      ...getDaysUrls(options, -1, 3, 'expanded-only'),
      {
        url: getMovieUrl(options),
        label: formatDate(options.date, weekdayDateMonthFormat),
        class: 'selected',
      },
      ...getDaysUrls(options, 1, 3, 'expanded-only'),
    ],
    hoursUrls: getHoursUrls(options),
    filtersUrls: [
      {
        url: ugcIllimiteUrl,
        label: 'Accepts UGC Illimité',
        class: options.ugcIllimiteOnly ? 'selected' : null,
      },
    ],
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
    pageTitle: `What's On`,
    chosenDate: fromDate,
    ...getUrls({ ...req.query, date: fromDate }),
  })
})

module.exports = router
