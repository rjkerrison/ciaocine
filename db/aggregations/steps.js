const { ObjectId } = require('bson')
const { default: mongoose } = require('mongoose')

const dollarise = (name) => (name.startsWith('$') ? name : `$${name}`)
const selectFields = (...names) =>
  Object.fromEntries(names.map((name) => [name, dollarise(name)]))

const selectPrefixedFields = (prefix, ...names) =>
  Object.fromEntries(
    names.map((name) => [name, dollarise(`${prefix}.${name}`)])
  )

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
      $push: selectFields('_id', 'cinema', 'startTime', 'movie'),
    },
  },
}

const sortBy = (key, direction = 1) => ({
  $sort: {
    [key]: direction,
  },
})

const sortById = sortBy('_id')
const sortByStartTime = sortBy('startTime')

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
    ...selectFields('_id', 'cinema', 'startTime'),
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

const populateFutureShowtimes = {
  $lookup: {
    from: 'showtimes',
    localField: 'showtime',
    foreignField: '_id',
    as: 'showtime',
    let: {
      fromDate: new Date(),
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [{ $gte: ['$startTime', '$$fromDate'] }],
          },
        },
      },
    ],
  },
}

const unwind = (name) => ({
  $unwind: dollarise(name),
})
const unwindShowtime = unwind('showtime')
const unwindCinema = unwind('cinema')
const unwindMovie = unwind('movie')

const projectToShowtime = {
  $project: selectPrefixedFields(
    'showtime',
    '_id',
    'movie',
    'cinema',
    'startTime'
  ),
}

const groupByMovie = {
  $group: {
    _id: '$movie',
    showtimes: {
      $push: selectFields('_id', 'cinema', 'startTime'),
    },
  },
}

const filterCinemaToUgcIllimite = {
  $match: {
    'cinema.member_cards.code': 106002,
  },
}

const filterCinemaById = (...cinemaIds) => {
  cinemaIds = cinemaIds.map((id) => {
    if (typeof id === 'string') {
      return new ObjectId(id)
    }
    return id
  })

  return {
    $match: {
      cinema: { $in: cinemaIds },
    },
  }
}

const riveGaucheArrondissements = [
  '75005',
  '75006',
  '75007',
  '75013',
  '75014',
  '75015',
]

const filterCinemaToRiveGauche = {
  $match: {
    'cinema.zipcode': {
      $in: riveGaucheArrondissements,
    },
  },
}

const filterCinemaToArrondissements = (arrondissements) => ({
  $match: {
    'cinema.zipcode': {
      $in: arrondissements,
    },
  },
})

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
  sortBy,
  populateMovie,
  populateCinema,
  populateMovieFromId,
  populateShowtime,
  populateFutureShowtimes,
  flattenShowtimeMovie,
  projectToShowtime,
  unwindMovie,
  unwindCinema,
  unwindShowtime,
  unwind,
  groupByMovie,
  filterCinemaToUgcIllimite,
  filterCinemaToRiveGauche,
  filterCinemaToRiveDroite,
  filterCinemaToArrondissements,
  filterCinemaById,
  selectFields,
}
