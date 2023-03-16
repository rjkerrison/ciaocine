import Showtime from '../../models/Showtime.model'

import {
  match,
  sortByStartTime,
  populateMovieFromId,
  groupByMovie,
  unwindMovie,
  matchDate,
} from './steps'

export const getShowtimesForCinemaGroupByMovie = async (
  cinemaId,
  { fromDate, toDate }
) => {
  const showtimes = await Showtime.aggregate([
    matchDate(fromDate, toDate),
    match(cinemaId),
    sortByStartTime,
    groupByMovie,
    populateMovieFromId,
    unwindMovie,
  ])

  return showtimes
}
