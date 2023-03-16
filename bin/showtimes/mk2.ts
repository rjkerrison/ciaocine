import { getShowtimesForCinemaAndDate } from '../../api/mk2'
import { Mk2Film, Mk2Session } from '../../api/types'
import Cinema, { CinemaSchema } from '../../models/Cinema.model'
import Movie, { MovieSchema } from '../../models/Movie.model'
import Showtime, { ShowtimeSchema } from '../../models/Showtime.model'
import { dateFormat, formatDate } from '../../utils/formatDate'
import { Ymd } from '../../utils/types'

const createShowtimesForCinemaAndDate = async (
  cinema: CinemaSchema,
  { year, month, day }: Ymd
) => {
  console.info(
    `Finding showtimes for ${cinema.name} on ${year}-${month}-${day}.`
  )

  const sessionsByFilmAndCinema = await getShowtimesForCinemaAndDate(
    cinema.slug,
    { year, month, day }
  )

  return Promise.all(
    sessionsByFilmAndCinema.map(({ film, sessions }) =>
      createShowtimesForFilm(film, sessions, cinema)
    )
  )
}

const toYmd = (date: Date): Ymd => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return { year, month, day }
}

const createShowtimesForCinema = async (cinema: CinemaSchema, dates: Ymd[]) => {
  return Promise.all(
    dates.map((date: Ymd) => createShowtimesForCinemaAndDate(cinema, date))
  )
}

const createShowtimesForFilm = async (
  { slug, title, id }: Mk2Film,
  sessions: Mk2Session[],
  cinema: CinemaSchema
) => {
  console.info(
    `Found ${sessions.length} showings for film ${title} for ${cinema.name}`
  )

  const movie = await Movie.findOne({
    $or: [
      {
        slug,
      },
      { title: { $regex: `^${title}`, $options: 'i' } },
    ],
  })

  if (movie === null) {
    return []
  }

  console.log({ title, id, foundId: movie?._id }, sessions.length)

  return Promise.all(
    sessions.map((session: Mk2Session) =>
      upsertShowtimeFromSession(session, movie, cinema)
    )
  )
}

const upsertShowtimeFromSession = async (
  session: Mk2Session,
  movie: MovieSchema,
  cinema: CinemaSchema
): Promise<ShowtimeSchema> => {
  const showtime = await upsertShowtime(
    movie,
    cinema,
    session.showTime,
    session.mk2ShowtimeId
  )
  return showtime
}

const upsertShowtime = async (
  movie: MovieSchema,
  cinema: CinemaSchema,
  startTime: string,
  mk2id: string
): Promise<ShowtimeSchema> => {
  const showtime = await Showtime.findOneAndUpdate(
    { movie, cinema, startTime },
    {
      movie,
      cinema,
      startTime,
      externalIds: { $push: { id: mk2id, source: 'mk2' } },
    },
    { upsert: true, new: true }
  )
  return showtime
}

const createShowtimesForAllMk2Cinemas = async () => {
  console.info('Creating Showtimes For All Mk2 Cinemas')

  const cinemas = await Cinema.find({ slug: { $regex: 'mk2' } })

  console.info(`Found ${cinemas.length} cinemas.`)

  const now = Date.now()
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(now + i * 86400 * 1000))
  }

  return Promise.all(
    cinemas.map((cinema: CinemaSchema) =>
      createShowtimesForCinema(cinema, dates.map(toYmd))
    )
  )
}

export { createShowtimesForAllMk2Cinemas }
