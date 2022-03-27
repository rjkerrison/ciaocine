const Showtime = require('../../models/Showtime.model')

const {
  match,
  sortByStartTime,
  populateMovieFromId,
  groupByMovie,
  unwindMovie,
} = require('./steps')

const getShowtimesForCinemaGroupByMovie = async (cinemaId) => {
  const showtimes = await Showtime.aggregate([
    match(cinemaId),
    sortByStartTime,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])
  return showtimes
}

module.exports = getShowtimesForCinemaGroupByMovie
