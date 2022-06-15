const Cinema = require('../../models/Cinema.model')

const twoKilometres = 2000
const geoNearGeolocation = (geolocation) => {
  return {
    $geoNear: {
      near: geolocation,
      distanceField: 'distance',
      maxDistance: twoKilometres,
      spherical: true,
    },
  }
}

const showtimesWithinDateRange = (fromDate, toDate) => {
  return {
    $lookup: {
      from: 'showtimes',
      localField: '_id',
      foreignField: 'cinema',
      as: 'showtimes',
      let: {
        fromDate,
        toDate,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $gte: ['$startTime', '$$fromDate'] },
                {
                  $lt: ['$startTime', '$$toDate'],
                },
              ],
            },
          },
        },
        {
          $project: {
            // _id: 0,
            cinema: '$cinema',
            movie: '$movie',
            startTime: '$startTime',
          },
        },
      ],
    },
  }
}

const groupShowtimes = {
  $group: {
    _id: 1,
    cinemas: {
      $push: { _id: '$_id', name: '$name' },
    },
    showtimes: {
      $push: '$showtimes',
    },
  },
}

const flattenShowtimes = {
  $project: {
    cinemas: '$cinemas',
    showtimes: [
      {
        $reduce: {
          input: '$showtimes',
          initialValue: [],
          in: {
            $concatArrays: ['$$value', '$$this'],
          },
        },
      },
    ],
  },
}

const unwind = (field) => ({
  $unwind: field,
})

const groupFields = {
  $group: {
    _id: 1,
    showtimes: {
      $push: '$showtimes',
    },
    cinemas: {
      $addToSet: '$cinemas',
    },
    movies: {
      $addToSet: '$showtimes.movie',
    },
  },
}

const lookupMovies = {
  $lookup: {
    from: 'movies',
    localField: 'movies',
    foreignField: '_id',
    as: 'movies',
  },
}

/**
 * A long aggregation to start with Cinemas in a radius,
 * filter to showtimes between two datetimes.
 * There is a lot of logic for grouping and flattening
 * and the eventual population of movies.
 *
 * @returns a single object containing all the movies, cinemas, and showtimes that match.
 */
const getMoviesNear = async (geolocation, fromDate, toDate) => {
  const showtimes = await Cinema.aggregate([
    geoNearGeolocation(geolocation),
    showtimesWithinDateRange(fromDate, toDate),
    groupShowtimes,
    flattenShowtimes,
    unwind('$showtimes'),
    groupFields,
    unwind('$showtimes'),
    unwind('$cinemas'),
    unwind('$movies'),
    lookupMovies,
  ])
  return showtimes[0]
}

module.exports = {
  getMoviesNear,
}
