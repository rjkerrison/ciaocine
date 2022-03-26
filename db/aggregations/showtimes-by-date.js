const { default: mongoose } = require('mongoose')
const Showtime = require('../../models/Showtime.model')

const match = (cinemaId) => ({
  $match: {
    cinema: new mongoose.Types.ObjectId(cinemaId),
  },
})

const groupByDate = {
  $group: {
    _id: {
      $dateToString: {
        date: '$startTime',
        format: '%Y-%m-%d',
      },
    },
    showtimes: {
      $push: {
        _id: '$_id',
        cinema: '$cinema',
        startTime: '$startTime',
        movie: '$movie',
      },
    },
  },
}

const sortById = {
  $sort: {
    _id: 1,
  },
}

const sortByStartTime = {
  $sort: {
    startTime: 1,
  },
}

const populateMovie = {
  $lookup: {
    from: 'movies',
    localField: 'movie',
    foreignField: '_id',
    as: 'movie',
  },
}

const project = {
  $project: {
    _id: '$_id',
    cinema: '$cinema',
    startTime: '$startTime',
    movie: { $arrayElemAt: ['$movie', 0] },
  },
}

const getShowtimesForCinemaGroupByDate = async (cinemaId) => {
  const showtimes = await Showtime.aggregate([
    match(cinemaId),
    sortByStartTime,
    populateMovie,
    project,
    groupByDate,
    sortById,
  ])
  return showtimes
}

module.exports = getShowtimesForCinemaGroupByDate
