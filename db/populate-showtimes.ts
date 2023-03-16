import Movie from '../models/Movie.model'
import Showtime from '../models/Showtime.model'
import { formatDate, dateMonthFormat, timeFormat } from '../utils/formatDate'

const saveShowtimeToDatabase = async ({ movie, screenings, cinema }) => {
  const saveShowtimesPromises = screenings.map((s) =>
    saveShowtimesFromAllocine({ ...s, movie, cinema })
  )
  const savedShowtimes = await Promise.all(saveShowtimesPromises)
  return savedShowtimes
}

export const saveShowtimesToDatabase = async (
  showtimesForMovieGroupedByDay,
  cinema
) => {
  const showtimes: any[] = []

  for (let {
    movie: fetchedMovie,
    scr: screenings,
    version,
  } of showtimesForMovieGroupedByDay) {
    if (!screenings) {
      continue
    }

    // awaiting movie save to prevent race condition in movie creation
    const movie = await saveMovieFromAllocine(fetchedMovie)

    if (!screenings) {
      return []
    }
    const savedShowtimes = await saveShowtimeToDatabase({
      movie,
      screenings,
      cinema,
    })

    const versionString = `V${version.original === 'true' ? 'O' : ''}${
      version.$ === 'Français' ? 'F' : 'stF ' + version.$
    }`
    console.log(
      `At ${cinema.name}, ${movie.title} (${versionString}) has ${
        savedShowtimes.flat().length
      } showtimes over ${savedShowtimes.length} days:
        ${savedShowtimes
          .flat()
          .map(
            (showtime) =>
              `${formatDate(showtime.startTime, timeFormat)} on ${formatDate(
                showtime.startTime,
                dateMonthFormat
              )}`
          )
          .join(', ')}
      `
    )

    showtimes.push(...savedShowtimes.flat())
  }
  return showtimes
}

const saveMovieFromAllocine = async ({
  code: allocineId,
  title,
  poster,
  release,
  castingShort,
  runtime,
}) => {
  const movie =
    (await Movie.findOne({ allocineId })) || new Movie({ allocineId })
  const isInvalidatingSlug = movie.title !== title

  Object.assign(movie, {
    title,
    poster: poster?.href,
    // We don't override the releaseDate if it exists,
    // because it may have been corrected by 'enhance' functionality.
    releaseDate: movie.releaseDate || release?.releaseDate,
    castingShort,
    runtime,
  })

  if (isInvalidatingSlug || !movie.slug) {
    movie.slug = await Movie.getUniqueSlugForMovie?.(movie)
  }

  await movie.save()
  return movie
}

const saveShowtimesFromAllocine = async ({
  d: date,
  t: times,
  movie,
  cinema,
}) => {
  if (!times) {
    return []
  }

  const showtimes = await Promise.all(
    times?.map(async ({ code, $ }) => {
      // this is far too hacky and needs to be changed
      // needs to meet format: '2022-04-25T14:00+01:00'
      // currently hardcoded to CET, which buys me until March
      const startTime = new Date(date + 'T' + $ + '+01:00')

      const showtime = await saveShowtimeFromAllocine({
        code,
        startTime,
        movie,
        cinema,
      })

      return showtime
    })
  )
  return showtimes
}

const saveShowtimeFromAllocine = async ({
  code: allocineId,
  startTime,
  movie,
  cinema,
}) => {
  const showtime = await Showtime.findOneAndUpdate(
    { movie, cinema, startTime },
    {
      allocineId,
      movie,
      cinema,
      startTime,
      externalIds: {
        $push: {
          id: allocineId,
          source: 'allocine',
        },
      },
    },
    { upsert: true, new: true }
  )
  return showtime
}
