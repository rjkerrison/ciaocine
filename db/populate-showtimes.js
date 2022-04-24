const Movie = require('../models/Movie.model')
const Showtime = require('../models/Showtime.model')

const populateShowtimes = async (showtimes, cinema) => {
  const showtimePromises = showtimes.flatMap(
    async ({ movie: fetchedMovie, scr }) => {
      const movie = await saveMovieFromAllocine(fetchedMovie)
      const saveShowtimesPromises = scr.map((s) =>
        saveShowtimesFromAllocine({ ...s, movie, cinema })
      )
      const result = await Promise.all(saveShowtimesPromises)
      return result
    }
  )

  const mappedShowtimes = await Promise.all(showtimePromises)
  console.log(
    `Populated ${mappedShowtimes.length} showtimes for ${cinema.name}`
  )
  return mappedShowtimes
}

const saveMovieFromAllocine = async ({ code: allocineId, title, poster }) => {
  const href = poster?.href
  const movie = await Movie.findOneAndUpdate(
    { allocineId },
    { allocineId, title, poster: href },
    { upsert: true, new: true }
  )
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
