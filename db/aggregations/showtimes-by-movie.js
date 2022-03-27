const Showtime = require('../../models/Showtime.model')

const {
  match,
  sortByStartTime,
  populateMovieFromId,
  flattenGroupedMovie,
  groupByMovie,
} = require('./steps')

const getShowtimesForCinemaGroupByMovie = async (cinemaId) => {
  const showtimes = await Showtime.aggregate([
    match(cinemaId),
    sortByStartTime,
    groupByMovie,
    populateMovieFromId,
    flattenGroupedMovie,
  ])
  return showtimes
}

module.exports = getShowtimesForCinemaGroupByMovie
