const { default: mongoose } = require('mongoose')

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
const populateMovieFromId = {
  $lookup: {
    from: 'movies',
    localField: '_id',
    foreignField: '_id',
    as: 'movies',
  },
}

const flattenShowtimeMovie = {
  $project: {
    _id: '$_id',
    cinema: '$cinema',
    startTime: '$startTime',
    movie: { $arrayElemAt: ['$movie', 0] },
  },
}

const flattenGroupedMovie = {
  $project: {
    showtimes: '$showtimes',
    movie: { $arrayElemAt: ['$movies', 0] },
    _id: 0,
  },
}

const groupByMovie = {
  $group: {
    _id: '$movie',
    showtimes: {
      $push: { _id: '$_id', cinema: '$cinema', startTime: '$startTime' },
    },
  },
}

module.exports = {
  match,
  groupByDate,
  sortById,
  sortByStartTime,
  populateMovie,
  populateMovieFromId,
  flattenShowtimeMovie,
  flattenGroupedMovie,
  groupByMovie,
}
