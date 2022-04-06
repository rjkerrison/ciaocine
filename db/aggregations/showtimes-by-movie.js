const Showtime = require('../../models/Showtime.model')

const {
  match,
  sortByStartTime,
  populateMovieFromId,
  groupByMovie,
  unwindMovie,
  matchDate,
} = require('./steps')

const getShowtimesForCinemaGroupByMovie = async (
  cinemaId,
  { fromDate, toDate }
) => {
  const showtimes = await Showtime.aggregate([
    matchDate(fromDate, toDate),
    match(cinemaId),
    sortByStartTime,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])

  return showtimes
}

module.exports = getShowtimesForCinemaGroupByMovie
