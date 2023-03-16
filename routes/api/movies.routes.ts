import { getMoviesFromTmdb } from '../../api/tmdb'
import getMovie from '../../middleware/getMovie.middleware'
import Movie from '../../models/Movie.model'

import relationshipRoutes from './movie-relationships.routes'

const router = require('express').Router()

const validTopByFields = ['want', 'watch']
const isValidTopByField = (field) => validTopByFields.includes(field)

/* GET movies */
router.get('/top/by/released', async (req, res, _next) => {
  const { page = 1 } = req.query
  const movies = await Movie.find({
    releaseDate: { $lt: new Date() },
  })
    .sort({ releaseDate: -1 })
    .populate('showtimes pastShowtimeCount wantCount watchCount')
    .limit(25)
    .skip(25 * (page - 1))

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

  const movies = await Movie.search(term)
    .limit(25)
    .skip(25 * (page - 1))
    .populate('showtimes pastShowtimeCount')

  res.json({
    movies,
  })
})

router.use('/:movieIdOrSlug', getMovie, relationshipRoutes)

export default router
