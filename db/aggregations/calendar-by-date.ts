import Calendar from '../../models/Calendar.model'
import {
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
} from './steps'

const getCalendarForUserGroupByDate = async (
  userId: string,
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

export { getCalendarForUserGroupByDate }
