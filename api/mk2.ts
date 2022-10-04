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
  film: any
  cinema: any
  sessions: any
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
    console.log(axiosError.response?.data?.message, cinemaSlug)
    return []
  }
}
