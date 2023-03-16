import axios, { AxiosError } from 'axios'
import { Ymd } from '../utils/types'

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

interface SessionsByFilmAndCinema {
  film: Mk2Film
  cinema: any
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

export const getShowtimesForCinemaAndDate = async (
  cinemaSlug: string,
  date: Ymd
): Promise<SessionsByFilmAndCinema[]> => {
  try {
    const config = getShowtimesForCinemaConfig(cinemaSlug, date)

    const {
      data: {
        sessionsByType: [{ sessionsByFilmAndCinema }],
      },
    } = await axios(config)

    return sessionsByFilmAndCinema
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.error(
      `Error occurred during ${getShowtimesForCinemaAndDate.name} for cinema ${cinemaSlug}:

  ${axiosError.response?.data?.message}`
    )
    return []
  }
}
