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

const getStartOfDay = (d) => {
  const date = d || new Date(Date.now())
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

const getMoviesForDate = async (date) => {
  const showtimes = await Showtime.aggregate([
    matchDate(getStartOfDay(date)),
    sortByStartTime,
    populateCinema,
    unwindCinema,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])
  return showtimes
}

module.exports = {
  getMoviesForDate,
}
