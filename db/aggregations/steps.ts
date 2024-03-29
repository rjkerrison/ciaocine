import { ObjectId } from 'bson'
import mongoose, { PipelineStage } from 'mongoose'

const dollarise = (name: string) => (name.startsWith('$') ? name : `$${name}`)
const selectFields = (...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, dollarise(name)]))

const selectPrefixedFields = (prefix: string, ...names: string[]) =>
  Object.fromEntries(
    names.map((name) => [name, dollarise(`${prefix}.${name}`)])
  )

const match = (value: string, name = 'cinema') => ({
  $match: {
    [name]: new mongoose.Types.ObjectId(value),
  },
})

const matchDate = (
  fromDate: Date,
  toDate?: Date,
  field = 'startTime'
): PipelineStage => {
  if (typeof toDate === 'undefined') {
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

const sortBy = (key: string, direction: 1 | -1 = 1): PipelineStage => ({
  $sort: {
    [key]: direction,
  },
})

const sortById = sortBy('_id')
const sortByStartTime = sortBy('startTime')

const populateCinema: PipelineStage = {
  $lookup: {
    from: 'cinemas',
    localField: 'cinema',
    foreignField: '_id',
    as: 'cinema',
  },
}

const populateMovie: PipelineStage = {
  $lookup: {
    from: 'movies',
    localField: 'movie',
    foreignField: '_id',
    as: 'movie',
  },
}
const populateMovieFromId: PipelineStage = {
  $lookup: {
    from: 'movies',
    localField: '_id',
    foreignField: '_id',
    as: 'movie',
  },
}

const flattenShowtimeMovie: PipelineStage = {
  $project: {
    ...selectFields('_id', 'cinema', 'startTime'),
    movie: { $arrayElemAt: ['$movie', 0] },
  },
}

const populateShowtime: PipelineStage = {
  $lookup: {
    from: 'showtimes',
    localField: 'showtime',
    foreignField: '_id',
    as: 'showtime',
  },
}

const populateFutureShowtimes: PipelineStage = {
  $lookup: {
    ...populateShowtime.$lookup,
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

const unwind = (name: string): PipelineStage => ({
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

const groupRelationshipByMovie = {
  $group: {
    _id: '$movie',
    showtimes: {
      $push: selectFields('_id', 'user'),
    },
  },
}

const filterCinemaToUgcIllimite = {
  $match: {
    'cinema.member_cards.code': 106002,
  },
}

const filterCinemaById = (
  ...cinemaIds: (ObjectId | string)[]
): PipelineStage => {
  const ids = cinemaIds.map((id): ObjectId => {
    if (typeof id === 'string') {
      return new ObjectId(id)
    }
    return id
  })

  return {
    $match: {
      cinema: { $in: ids },
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

const flatten = (name: string) => ({
  $reduce: {
    input: dollarise(name),
    initialValue: [],
    in: {
      $concatArrays: ['$$value', '$$this'],
    },
  },
})

export {
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
  flatten,
  projectToShowtime,
  unwindMovie,
  unwindCinema,
  unwindShowtime,
  unwind,
  groupByMovie,
  groupRelationshipByMovie,
  filterCinemaToUgcIllimite,
  filterCinemaToRiveGauche,
  filterCinemaToRiveDroite,
  filterCinemaToArrondissements,
  filterCinemaById,
  selectFields,
}
