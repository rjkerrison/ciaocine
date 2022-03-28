const { default: mongoose } = require('mongoose')

const match = (cinemaId) => ({
  $match: {
    cinema: new mongoose.Types.ObjectId(cinemaId),
  },
})

const matchDate = (fromDate, toDate, field = 'startTime') => {
  if (!toDate) {
    toDate = new Date(fromDate)
    toDate.setDate(fromDate.getDate() + 1)
  }

  return {
    $match: {
      [field]: {
        $gte: fromDate,
        $lt: toDate,
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

const filterCinemaToUgcIllimite = {
  $match: {
    'cinema.member_cards.code': 106002,
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
  filterCinemaToUgcIllimite,
}