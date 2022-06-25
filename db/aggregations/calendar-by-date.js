const Calendar = require('../../models/Calendar.model')
const {
  match,
  sortByStartTime,
  groupByDate,
  projectToShowtime,
  populateMovie,
  populateShowtime,
  populateCinema,
  unwindMovie,
  unwindShowtime,
  unwindCinema,
  sortById,
  populateFutureShowtimes,
} = require('./steps')

const getCalendarForUserGroupByDate = async (
  userId,
  { delorean = false } = {}
) => {
  const calendar = await Calendar.aggregate([
    match(userId, 'user'),
    delorean ? populateShowtime : populateFutureShowtimes,
    unwindShowtime,
    projectToShowtime,
    sortByStartTime,
    populateMovie,
    unwindMovie,
    populateCinema,
    unwindCinema,
    groupByDate,
    sortById,
  ])
  return calendar
}

module.exports = {
  getCalendarForUserGroupByDate,
}
