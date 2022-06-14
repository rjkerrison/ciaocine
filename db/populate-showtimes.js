const { getUniqueSlugForMovie } = require('../models/Movie.model')
const Movie = require('../models/Movie.model')
const Showtime = require('../models/Showtime.model')

const populateShowtime = async ({ movie: fetchedMovie, scr }, cinema) => {
  if (!scr) {
    return []
  }
  const movie = await saveMovieFromAllocine(fetchedMovie)
  const saveShowtimesPromises = scr.map((s) =>
    saveShowtimesFromAllocine({ ...s, movie, cinema })
  )
  const result = await Promise.all(saveShowtimesPromises)
  return result
}

const populateShowtimes = async (showtimes, cinema) => {
  const results = []
  for (let showtime of showtimes) {
    // awaiting each individually to prevent race condition in movie creation
    const result = await populateShowtime(showtime, cinema)
    results.push(...result)
  }

  return results
}

const saveMovieFromAllocine = async ({
  code: allocineId,
  title,
  poster,
  release,
  castingShort,
  runtime,
}) => {
  const href = poster?.href
  const releaseDate = release?.releaseDate
  let movie = (await Movie.findOne({ allocineId })) || new Movie({ allocineId })

  const isInvalidatingSlug = movie.title !== title

  movie.title = title
  movie.poster = href
  movie.releaseDate = releaseDate
  movie.castingShort = castingShort
  movie.runtime = runtime

  if (isInvalidatingSlug || !movie.slug) {
    movie.slug = await getUniqueSlugForMovie(movie)
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
  const result = await Promise.all(
    times.map(async ({ code, $ }) => {
      // this is far too hacky and needs to be changed
      // needs to meet format: '2022-04-25T14:00+02:00'
      // currently hardcoded to CEST, which buys me a few months
      const startTime = new Date(date + 'T' + $ + '+02:00')

      const result = await saveShowtimeFromAllocine({
        code,
        startTime,
        movie,
        cinema,
      })

      return result
    })
  )
  return result
}

const saveShowtimeFromAllocine = async ({
  code: allocineId,
  startTime,
  movie,
  cinema,
}) => {
  const showtime = await Showtime.findOneAndUpdate(
    { movie, cinema, startTime },
    { allocineId, movie, cinema, startTime },
    { upsert: true, new: true }
  )
  return showtime
}

module.exports = {
  populateShowtimes,
}
