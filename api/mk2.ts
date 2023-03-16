import axios, { AxiosError } from 'axios'
import { Ymd } from '../utils/types'
import { findCinema } from './helpers/mk2-complex'
import {
  Mk2CinemaComplex,
  SessionByFilmAndCinema,
  SessionsByType,
} from './types'

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

const getSessionsByTypeForCinema = (
  cinema: Mk2CinemaComplex,
  sessionsByType?: SessionsByType
): SessionByFilmAndCinema[] => {
  if (typeof sessionsByType === 'undefined' || sessionsByType?.length === 0) {
    console.error('sessionsByType is', sessionsByType, 'cinema', cinema)
    return []
  }
  try {
    // Only look at films
    const filmSessionsByCinema = sessionsByType.find(
      (x) => x.type?.id === 'film'
    )
    if (typeof filmSessionsByCinema === 'undefined') {
      return []
    }

    // Finally, filter for the current cinema
    return filmSessionsByCinema.sessionsByFilmAndCinema.filter(
      (x) => x.cinema.slug === cinema.cinema.slug
    )
  } catch (e) {
    console.error('sessionsByType is', sessionsByType, 'cinema', cinema)
    throw e
  }
}

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
    } = await axios(config)

    return getSessionsByTypeForCinema(cinema, sessionsByType)
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
  }
}
