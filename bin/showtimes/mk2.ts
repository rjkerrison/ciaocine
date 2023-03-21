import { HydratedDocument } from 'mongoose'
import { getShowtimesForCinemaAndDate } from '../../api/mk2'
import { CastPersonType, Mk2Cast, Mk2Film, Mk2Session } from '../../api/types'
import Cinema, { CinemaSchema } from '../../models/Cinema.model'
import Movie, { CastingShort, MovieSchema } from '../../models/Movie.model'
import Showtime, { ShowtimeSchema } from '../../models/Showtime.model'
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

  for (const { film, sessions } of sessionsByFilmAndCinema) {
    await createShowtimesForFilm(film, sessions, cinema)
  }
}

const toYmd = (date: Date): Ymd => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return { year, month, day }
}

const createShowtimesForCinema = async (cinema: CinemaSchema, dates: Ymd[]) => {
  // We don't parallelise, to avoid duplicated movies
  for (const date of dates) {
    await createShowtimesForCinemaAndDate(cinema, date)
  }
}

const filterMk2CastToCsv = (cast: Mk2Cast, type: CastPersonType) => {
  return cast
    .filter((x) => x.personType === type)
    .map((x) => `${x.firstName} ${x.lastName}`)
    .join(', ')
}

const mk2CastToCastingShort = (cast: Mk2Cast): CastingShort => {
  return {
    directors: filterMk2CastToCsv(cast, 'Director'),
    actors: filterMk2CastToCsv(cast, 'Actor'),
  }
}

const assignMk2FieldsToMovie = async (
  movie: HydratedDocument<MovieSchema>,
  {
    id,
    slug,
    title,
    graphicUrl,
    openingDate,
    cast,
    runTime,
    synopsis,
    backdropUrl,
  }: Mk2Film
): Promise<void> => {
  const isInvalidatingSlug = movie.title !== title

  const fieldsToAssign: Partial<MovieSchema> = {
    externalIdentifiers: { mk2: { id, slug } },
    // We don't override what already exists
    title: movie.title || title,
    poster: movie.poster || graphicUrl,
    releaseDate: movie.releaseDate || openingDate,
    castingShort: movie.castingShort || mk2CastToCastingShort(cast),
    runtime: movie.runtime || runTime,
    synopsis: movie.synopsis || synopsis,
    images: movie.images || {
      poster: graphicUrl,
      backdrop: backdropUrl,
    },
  }

  Object.assign(movie, fieldsToAssign)

  if (isInvalidatingSlug || !movie.slug) {
    movie.slug = await Movie.getUniqueSlugForMovie(movie)
  }
  try {
    await movie.save()
  } catch (e) {
    console.error(e)
  }
}

const createShowtimesForFilm = async (
  mk2Film: Mk2Film,
  sessions: Mk2Session[],
  cinema: CinemaSchema
) => {
  const { title, id, slug } = mk2Film

  const movie =
    (await Movie.findOne({
      $or: [
        { title: { $regex: `^${title}$`, $options: 'i' } },
        {
          externalIdentifiers: { mk2: { id } },
        },
        {
          externalIdentifiers: { mk2: { slug } },
        },
      ],
    })) || new Movie()

  await assignMk2FieldsToMovie(movie, mk2Film)

  console.info(
    `Found ${sessions.length} showings for film ${title} (${movie?._id}) for ${cinema.name}.`
  )

  for (const session of sessions) {
    await upsertShowtimeFromSession(session, movie, cinema)
  }
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

  // We don't parallelise, to avoid issues with duplicating movies
  for (const cinema of cinemas) {
    await createShowtimesForCinema(cinema, dates.map(toYmd))
  }
}

export { createShowtimesForAllMk2Cinemas }
