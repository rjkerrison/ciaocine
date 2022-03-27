const Movie = require('../models/Movie.model')
const Showtime = require('../models/Showtime.model')

const populateShowtimes = (showtimes, cinema) => {
  showtimes.forEach(async ({ movie: fetchedMovie, scr }) => {
    const movie = await saveMovieFromAllocine(fetchedMovie)
    scr.forEach((s) => saveShowtimesFromAllocine({ ...s, movie, cinema }))
  })
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
  times.forEach(({ code, $ }) => {
    // this is far too hacky and needs to be changed
    const startTime = new Date(date + ' ' + $)

    return saveShowtimeFromAllocine({
      code,
      startTime,
      movie,
      cinema,
    })
  })
}

const saveShowtimeFromAllocine = async ({
  code: allocineId,
  startTime,
  movie,
  cinema,
}) => {
  const showtime = await Showtime.findOneAndUpdate(
    { allocineId },
    { allocineId, movie, cinema, startTime },
    { upsert: true, new: true }
  )
  return showtime
}

module.exports = {
  populateShowtimes,
}
