const { default: mongoose } = require('mongoose')

const match = (value, name = 'cinema') => ({
  $match: {
    [name]: new mongoose.Types.ObjectId(value),
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

const populateShowtime = {
  $lookup: {
    from: 'showtimes',
    localField: 'showtime',
    foreignField: '_id',
    as: 'showtime',
  },
}

const unwindShowtime = {
  $unwind: '$showtime',
}

const projectToShowtime = {
  $project: {
    _id: '$showtime._id',
    movie: '$showtime.movie',
    cinema: '$showtime.cinema',
    startTime: '$showtime.startTime',
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

const riveGaucheArrondissements = [
  ['75005', '75006', '75007', '75013', '75014', '75015'],
]

const filterCinemaToRiveGauche = {
  $match: {
    'cinema.zipcode': {
      $in: riveGaucheArrondissements,
    },
  },
}

const filterCinemaToRiveDroite = {
  $match: {
    'cinema.zipcode': {
      $nin: riveGaucheArrondissements,
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
  populateShowtime,
  flattenShowtimeMovie,
  projectToShowtime,
  unwindMovie,
  unwindCinema,
  unwindShowtime,
  groupByMovie,
  filterCinemaToUgcIllimite,
  filterCinemaToRiveGauche,
  filterCinemaToRiveDroite,
}
