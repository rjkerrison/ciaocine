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

const getToday = () => {
  const date = new Date(Date.now())
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
  return date
}

const getMoviesForDate = async (date) => {
  const showtimes = await Showtime.aggregate([
    matchDate(date || getToday()),
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
