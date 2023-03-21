import axios, { AxiosError } from 'axios'
import { Ymd } from '../utils/types'
import { findCinema } from './helpers/mk2-complex'
import {
  Mk2CinemaComplex,
  SessionByFilmAndCinema,
  SessionsByType,
} from './types'

const baseUrl = 'https://prod.api.mk2.com/cinema-complex'

const displayYmd = ({ year, month, day }: Ymd): string =>
  `${year}-${month}-${day}`

const getShowtimesForCinemaConfig = (slug: string, ymd: Ymd) => {
  return {
    baseURL: baseUrl,
    url: slug,
    params: {
      'show-time_gt': displayYmd(ymd),
    },
  }
}

const getSessionsByTypeForCinema = (
  cinema: Mk2CinemaComplex,
  sessionsByType: SessionsByType
): SessionByFilmAndCinema[] => {
  try {
    // Only look at films
    const filmSessionsByCinema = sessionsByType.find(
      (x) => x.type?.id === 'film'
    )
    if (typeof filmSessionsByCinema === 'undefined') {
      return []
    }

    // Finally, filter for the current cinema
    const filtered = filmSessionsByCinema.sessionsByFilmAndCinema.filter(
      (x) => x.cinema.slug === cinema.cinema.slug
    )
    return filtered
  } catch (e) {
    console.error(e)
    console.info({
      sessionsByType,
      cinema,
    })
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

    if (typeof sessionsByType === 'undefined' || sessionsByType?.length === 0) {
      console.warn(
        `No sessions found for ${cinema.cinema.ciaocineSlug} on ${displayYmd(
          date
        )}`
      )
      return []
    }

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
