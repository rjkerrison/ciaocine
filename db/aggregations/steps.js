const { default: mongoose } = require('mongoose')

const match = (cinemaId) => ({
  $match: {
    cinema: new mongoose.Types.ObjectId(cinemaId),
  },
})

const matchDate = (date, field = 'startTime') => {
  const tomorrow = date.getDate() + 1
  const nextDay = new Date(date)
  nextDay.setDate(tomorrow)

  return {
    $match: {
      [field]: {
        $gte: date,
        $lt: nextDay,
      },
    },
  }
}

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

const populateCinema = {
  $lookup: {
    from: 'cinemas',
    localField: 'cinema',
    foreignField: '_id',
    as: 'cinema',
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
    as: 'movie',
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

const unwindCinema = {
  $unwind: '$cinema',
}

const unwindMovie = {
  $unwind: '$movie',
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
  matchDate,
  groupByDate,
  sortById,
  sortByStartTime,
  populateMovie,
  populateCinema,
  populateMovieFromId,
  flattenShowtimeMovie,
  unwindMovie,
  unwindCinema,
  groupByMovie,
}
