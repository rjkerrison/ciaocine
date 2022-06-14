const Showtime = require('../../models/Showtime.model')
const {
  matchDate,
  sortByStartTime,
  populateMovieFromId,
  groupByMovie,
  unwindMovie,
} = require('./steps')

const getMoviesBetweenTimes = async (fromDate, toDate, additionalFilters) => {
  const showtimes = await Showtime.aggregate([
    matchDate(fromDate, toDate),
    sortByStartTime,
    ...additionalFilters,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])
  return showtimes
}

module.exports = {
  getMoviesBetweenTimes,
}
