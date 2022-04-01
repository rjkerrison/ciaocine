const { getRandomPosterUrl } = require('../../config/fakeposters')
const {
  getMoviesBetweenTimes,
} = require('../../db/aggregations/movies-showing-by-date')
const {
  filterCinemaToUgcIllimite,
  filterCinemaToRiveGauche,
} = require('../../db/aggregations/steps')
const { APP_URL } = require('../../utils/consts')
const { formatDate, weekdayDateMonthFormat } = require('../../utils/formatDate')

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
  let date
  try {
    date = params.date.toISOString()
  } catch {
    date = new Date(Date.now()).toISOString()
  }

  return appendSearchParams(new URL(`${APP_URL}/movies`), {
    ...params,
    date,
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

  return { url, label, class: 'expanded-only' }
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

const getAdditionalFilters = (ugcIllimiteOnly, rive) => {
  const additionalFilters = []

  if (Boolean(ugcIllimiteOnly)) {
    additionalFilters.push(filterCinemaToUgcIllimite)
  }
  switch (rive) {
    case 'niq':
      break
    case 'gauche':
      additionalFilters.push(filterCinemaToRiveGauche)
      break
    case 'droite':
      additionalFilters.push(filterCinemaToRiveDroite)
      break
  }
  return additionalFilters
}

const getMovies = async ({
  fromHour = 0,
  toHour = 24,
  date = new Date(),
  ugcIllimiteOnly = false,
  rive = 'niq',
}) => {
  const fromDate = getDateHour(date, fromHour)
  const toDate = getDateHour(date, toHour)

  const additionalFilters = getAdditionalFilters(ugcIllimiteOnly, rive)

  const movies = await getMoviesBetweenTimes(
    fromDate,
    toDate,
    additionalFilters
  )

  movies.forEach((movie) => (movie.poster ||= getRandomPosterUrl()))
  return { movies, fromDate }
}

module.exports = { getMovies, getUrls }
