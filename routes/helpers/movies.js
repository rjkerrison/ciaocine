const { getRandomPosterUrl } = require('../../config/fakeposters')
const {
  getMoviesBetweenTimes,
} = require('../../db/aggregations/movies-showing-by-date')
const {
  filterCinemaToUgcIllimite,
  filterCinemaToRiveGauche,
  filterCinemaToRiveDroite,
} = require('../../db/aggregations/steps')
const { APP_URL } = require('../../utils/consts')
const { formatDate, weekdayDateMonthFormat } = require('../../utils/formatDate')
const { adjustDateByDays } = require('./dates')
const { appendSearchParams } = require('./params')

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

const getCalendarUrls = (options) => {
  return [
    ...getDaysUrls(options, -1, 3, 'expanded-only'),
    {
      url: getMovieUrl(options),
      label: formatDate(options.date, weekdayDateMonthFormat),
      class: 'selected',
    },
    ...getDaysUrls(options, 1, 3, 'expanded-only'),
  ]
}

const getUrls = (options) => {
  const ugcIllimiteUrl = getMovieUrl({
    ...options,
    // deselection
    ugcIllimiteOnly: !options.ugcIllimiteOnly,
  })
  const riveDroiteUrl = getMovieUrl({
    ...options,
    rive: options.rive === 'droite' ? 'niq' : 'droite',
  })
  const riveGaucheUrl = getMovieUrl({
    ...options,
    rive: options.rive === 'gauche' ? 'niq' : 'gauche',
  })

  return {
    calendarUrls: getCalendarUrls(options),
    hoursUrls: getHoursUrls(options),
    filtersUrls: [
      {
        url: ugcIllimiteUrl,
        label: 'Accepts UGC Illimité',
        class: options.ugcIllimiteOnly ? 'selected' : null,
      },
      {
        url: riveDroiteUrl,
        label: 'Rive Droite',
        class: options.rive === 'droite' ? 'selected' : null,
      },
      {
        url: riveGaucheUrl,
        label: 'Rive Gauche',
        class: options.rive === 'gauche' ? 'selected' : null,
      },
    ],
  }
}

const getAdditionalFilters = (ugcIllimiteOnly, rive, cinema) => {
  const additionalFilters = []

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

  if (Boolean(ugcIllimiteOnly)) {
    additionalFilters.push(filterCinemaToUgcIllimite)
  }

  return additionalFilters
}

const getMovies = async ({
  fromDate,
  toDate,
  ugcIllimiteOnly = false,
  rive = 'niq',
  cinema = null,
}) => {
  const additionalFilters = getAdditionalFilters(ugcIllimiteOnly, rive, cinema)

  const movies = await getMoviesBetweenTimes(
    fromDate,
    toDate,
    additionalFilters
  )

  movies.forEach((movie) => (movie.poster ||= getRandomPosterUrl()))
  return movies
}

module.exports = { getMovies, getUrls, getCalendarUrls }
