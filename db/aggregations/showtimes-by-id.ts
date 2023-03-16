const Showtime = require('../../models/Showtime.model')
const {
  match,
  populateMovie,
  unwindMovie,
  populateCinema,
  unwindCinema,
} = require('./steps')

const getShowtimeById = async (showtimeId) => {
  const showtimes = await Showtime.aggregate([
    match(showtimeId, '_id'),
    populateMovie,
    unwindMovie,
    populateCinema,
    unwindCinema,
  ])
  return showtimes[0]
}

export default getShowtimeById
