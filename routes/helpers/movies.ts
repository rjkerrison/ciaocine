import { PipelineStage } from 'mongoose'
import { getRandomPosterUrl } from '../../config/fakeposters'
import { getMoviesBetweenTimes } from '../../db/aggregations/movies-showing-by-date'
import {
  filterCinemaToUgcIllimite,
  filterCinemaToRiveGauche,
  filterCinemaToRiveDroite,
  filterCinemaById,
  filterCinemaToArrondissements,
  populateCinema,
  unwindCinema,
} from '../../db/aggregations/steps'
import { APP_URL, URL_SEPARATOR } from '../../utils/consts'
import { formatDate, weekdayDateMonthFormat } from '../../utils/formatDate'
import { adjustDateByDays } from './dates'
import { appendSearchParams } from './params'

const getUrl = ({ url = '/movies', ...params }) => {
  let date
  try {
    date = params.date.toISOString()
  } catch {
    date = new Date(Date.now()).toISOString()
  }

  return appendSearchParams(new URL(`${APP_URL}${url}`), {
    ...params,
    date,
  })
}

const getDaysUrls = (options, step, count, classname) => {
  const dates: Date[] = []

  for (let i = 1; i <= count; i++) {
    const date = adjustDateByDays(options.date, i * step)
    dates.push(date)
  }

  dates.sort((a, b) => a.getTime() - b.getTime())
  const results = dates.map((date) => {
    const url = getUrl({
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
      url: getUrl({
        ...options,
        fromHour: null,
      }),
      label,
      class: 'selected',
    }
  }

  const url = getUrl({
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
      url: getUrl({
        url: '/movies',
        ...options,
      }),
      label: formatDate(options.date, weekdayDateMonthFormat),
      class: 'selected',
    },
    ...getDaysUrls(options, 1, 3, 'expanded-only'),
  ]
}

const getUrls = (options) => {
  const ugcIllimiteUrl = getUrl({
    url: '/movies',
    ...options,
    // deselection
    ugcIllimiteOnly: !options.ugcIllimiteOnly,
  })
  const riveDroiteUrl = getUrl({
    url: '/movies',
    ...options,
    rive: options.rive === 'droite' ? 'niq' : 'droite',
  })
  const riveGaucheUrl = getUrl({
    url: '/movies',
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

const getAdditionalFilters = (
  ugcIllimiteOnly,
  rive,
  cinemaId,
  arrondissements
) => {
  const additionalFilters: PipelineStage[] = []

  if (cinemaId) {
    // override any other filters if a cinema id is specified
    return [filterCinemaById(cinemaId)]
  } else {
    additionalFilters.push(populateCinema)
    additionalFilters.push(unwindCinema)
  }

  switch (rive) {
    case 'gauche':
      additionalFilters.push(filterCinemaToRiveGauche)
      break
    case 'droite':
      additionalFilters.push(filterCinemaToRiveDroite)
      break
    case 'niq':
    default:
      if (arrondissements) {
        additionalFilters.push(
          filterCinemaToArrondissements(arrondissements.split(URL_SEPARATOR))
        )
      }
      break
  }

  if (ugcIllimiteOnly === 'true') {
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
  arrondissements = null,
}) => {
  const additionalFilters = getAdditionalFilters(
    ugcIllimiteOnly,
    rive,
    cinema,
    arrondissements
  )

  const movies = await getMoviesBetweenTimes(
    fromDate,
    toDate,
    additionalFilters
  )

  movies.forEach((movie) => (movie.poster ||= getRandomPosterUrl()))
  return movies
}

export default { getMovies, getUrls, getCalendarUrls }
