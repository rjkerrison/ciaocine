import Showtime from '../../models/Showtime.model'
import {
  matchDate,
  sortByStartTime,
  populateMovieFromId,
  groupByMovie,
  unwindMovie,
} from './steps'

export const getMoviesBetweenTimes = async (
  fromDate,
  toDate,
  additionalFilters
) => {
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
