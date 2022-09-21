const { getMoviesFromTmdb } = require('../../api/tmdb')
const getMovie = require('../../middleware/getMovie.middleware')
const Movie = require('../../models/Movie.model')

const router = require('express').Router()

/* GET movies */
router.get('/', async (_req, res, _next) => {
  const movies = await Movie.find()

  res.json({
    movies,
  })
})

/* GET movies/:movieid */
router.get('/:movieIdOrSlug', async (req, res, next) => {
  const movie = await Movie.findBySlugOrId(req.params.movieIdOrSlug).populate(
    'showtimes pastShowtimeCount'
  )

  if (!movie) {
    res.status(404).json({ error: 'movie not found' })
    return
  }

  res.json({
    movie,
    tmdbInfo: await getMoviesFromTmdb(movie.originalTitle || movie.title, {
      year: movie?.releaseDate?.getFullYear(),
      director: movie?.castingShort?.directors,
    }),
  })
})

/* GET movies/:movieid */
router.get('/search/:term', async (req, res, _next) => {
  const { term } = req.params
  const { page = 1 } = req.query
  const query = { $regex: term, $options: 'i' }

  const movies = await Movie.find({
    $or: [
      'title',
      'originalTitle',
      'castingShort.directors',
      'castingShort.actors',
    ].map((field) => ({
      [field]: query,
    })),
  })
    .limit(25)
    .skip(25 * (page - 1))
    .populate('showtimes pastShowtimeCount')

  res.json({
    movies,
  })
})

router.use('/:movieIdOrSlug', getMovie, require('./movie-relationships.routes'))

module.exports = router
