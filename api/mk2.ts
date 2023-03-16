import axios, { AxiosError } from 'axios'
import { Ymd } from '../utils/types'
import {
  findCinema,
  findComplexForCinema,
  Mk2Cinema,
} from './helpers/mk2-complex'

const baseUrl = 'https://prod.api.mk2.com/cinema-complex'

const getShowtimesForCinemaConfig = (
  slug: string,
  { year, month, day }: Ymd
) => {
  return {
    baseURL: baseUrl,
    url: slug,
    params: {
      'show-time_gt': `${year}-${month}-${day}`,
    },
  }
}

interface SessionByFilmAndCinema {
  film: Mk2Film
  cinema: Mk2Cinema
  sessions: Mk2Session[]
}

export interface Mk2Film {
  slug: string
  title: string
  id: string
}

export interface Mk2Session {
  showTime: string
  mk2ShowtimeId: string
}

export interface FilmSessions {
  type: { id: 'film'; name: 'Film' }
  sessionsByFilmAndCinema: Array<SessionByFilmAndCinema>
}

export interface SessionsByType extends Array<FilmSessions> {}

export const getShowtimesForCinemaAndDate = async (
  cinemaSlug: string,
  date: Ymd
): Promise<SessionByFilmAndCinema[]> => {
  const cinema = findCinema(cinemaSlug)

  if (typeof cinema === 'undefined') {
    throw Error(`Unknown cinema slug: ${cinemaSlug}`)
  }

  const config = getShowtimesForCinemaConfig(cinema.complexSlug, date)

  try {
    const {
      data: { sessionsByType },
    } = await axios.get<{ sessionsByType?: SessionsByType }>('', config)

    if (typeof sessionsByType === 'undefined' || sessionsByType?.length === 0) {
      return []
    }
    // Only look at films
    const filmSessionsByCinema = sessionsByType.find(
      (x) => x.type.id === 'film'
    )
    if (typeof filmSessionsByCinema === 'undefined') {
      return []
    }

    // Finally, filter for the current cinema
    return filmSessionsByCinema.sessionsByFilmAndCinema.filter(
      (x) => x.cinema.slug === cinema.cinema.slug
    )
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.error(
      `Error occurred during ${
        getShowtimesForCinemaAndDate.name
      } for cinema ${cinemaSlug}:

  ${axiosError.response?.data?.message}
  
  config: ${JSON.stringify(config, undefined, 2)}
  `
    )
    throw axiosError
    return []
  }
}
