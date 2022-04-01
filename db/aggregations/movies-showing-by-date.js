const Showtime = require('../../models/Showtime.model')
const {
  matchDate,
  sortByStartTime,
  populateMovieFromId,
  groupByMovie,
  populateCinema,
  unwindCinema,
  unwindMovie,
} = require('./steps')

const getMoviesForDate = async (date) => {
  const showtimes = await Showtime.aggregate([
    matchDate(date),
    sortByStartTime,
    populateCinema,
    unwindCinema,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])
  return showtimes
}

const getMoviesBetweenTimes = async (fromDate, toDate, additionalFilters) => {
  const showtimes = await Showtime.aggregate([
    matchDate(fromDate, toDate),
    sortByStartTime,
    populateCinema,
    unwindCinema,
    ...additionalFilters,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])
  return showtimes
}

module.exports = {
  getMoviesForDate,
  getMoviesBetweenTimes,
}
