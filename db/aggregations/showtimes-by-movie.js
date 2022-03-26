const { default: mongoose } = require('mongoose')
const Showtime = require('../../models/Showtime.model')

const match = (cinemaId) => ({
  $match: {
    cinema: new mongoose.Types.ObjectId(cinemaId),
  },
})
const groupByMovie = {
  $group: {
    _id: '$movie',
    showtimes: {
      $push: { _id: '$_id', cinema: '$cinema', startTime: '$startTime' },
    },
  },
}
const populateMovie = {
  $lookup: {
    from: 'movies',
    localField: '_id',
    foreignField: '_id',
    as: 'movies',
  },
}
const project = {
  $project: {
    showtimes: '$showtimes',
    movie: { $arrayElemAt: ['$movies', 0] },
    _id: 0,
  },
}

const getShowtimesForCinemaGroupByMovie = async (cinemaId) => {
  const showtimes = await Showtime.aggregate([
    match(cinemaId),
    groupByMovie,
    populateMovie,
    project,
  ])
  return showtimes
}

module.exports = getShowtimesForCinemaGroupByMovie
