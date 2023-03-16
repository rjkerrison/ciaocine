import Showtime from '../../models/Showtime.model'
import {
  match,
  sortByStartTime,
  populateMovie,
  unwindMovie,
  groupByDate,
  sortById,
} from './steps'

export const getShowtimesForCinemaGroupByDate = async (cinemaId) => {
  const showtimes = await Showtime.aggregate([
    match(cinemaId),
    sortByStartTime,
    populateMovie,
    unwindMovie,
    groupByDate,
    sortById,
  ])
  return showtimes
}
