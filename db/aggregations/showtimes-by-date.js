const Showtime = require('../../models/Showtime.model')
const {
  match,
  sortByStartTime,
  populateMovie,
  unwindMovie,
  groupByDate,
  sortById,
} = require('./steps')

const getShowtimesForCinemaGroupByDate = async (cinemaId) => {
  const showtimes = await Showtime.aggregate([
    match(cinemaId),
    sortByStartTime,
    populateMovie,
    unwindMovie,
    groupByDate,
    sortById,
  ])
  return showtimes
}

module.exports = getShowtimesForCinemaGroupByDate
