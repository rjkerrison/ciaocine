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
} = require('./steps')

const getCalendarForUserGroupByDate = async (userId) => {
  const calendar = await Calendar.aggregate([
    match(userId, 'user'),
    populateShowtime,
    unwindShowtime,
    projectToShowtime,
    sortByStartTime,
    populateMovie,
    unwindMovie,
    populateCinema,
    unwindCinema,
    groupByDate,
  ])
  return calendar
}

module.exports = {
  getCalendarForUserGroupByDate,
}
