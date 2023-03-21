import { Router } from 'express'
import { Model } from 'mongoose'
import { getMoviesFromTmdb, TmdbInfo } from '../../api/tmdb'
import { groupRelationshipByMovie } from '../../db/aggregations/steps'
import getMovie from '../../middleware/getMovie.middleware'
import Movie from '../../models/Movie.model'
import { Want, Watch } from '../../models/UserMovieRelationship'

import relationshipRoutes from './movie-relationships.routes'

const router = Router()

const validTopByFields: [string, Model<any>][] = [
  ['want', Want],
  ['watch', Watch],
]

// e.g. /top/by/want?page=1 gets the top 25 movies
// ordered by how many wantlists it's listed on
validTopByFields.forEach(([field, Relationship]) => {
  router.get(`/top/by/${field}`, async (req, res, _next) => {
    const { page = 1 } = req.query

    const movies = await Relationship.aggregate([groupRelationshipByMovie])
      .sortByCount({ $user: -1 })
      .limit(25)
      .skip(25 * (Number(page) - 1))

    res.json({
      movies,
    })
  })
})

/* GET movies */
router.get('/top/by/released', async (req, res, _next) => {
  const { page = 1 } = req.query
  const movies = await Movie.find({
    releaseDate: { $lt: new Date() },
  })
    .sort({ releaseDate: -1 })
    .populate('showtimes pastShowtimeCount wantCount watchCount')
    .limit(25)
    .skip(25 * (Number(page) - 1))

  res.json({
    movies,
  })
})

/* GET movies/:movieid */
router.get('/:movieIdOrSlug', async (req, res, _next) => {
  const movie = await Movie.findBySlugOrId(req.params.movieIdOrSlug).populate(
    'showtimes pastShowtimeCount'
  )

  if (!movie) {
    res.status(404).json({ error: 'movie not found' })
    return
  }

  let tmdbInfo: TmdbInfo[] | null = null
  const searchTitle = movie.originalTitle || movie.title
  if (typeof searchTitle !== 'undefined') {
    tmdbInfo = await getMoviesFromTmdb(searchTitle, {
      year: movie?.releaseDate?.getFullYear(),
      director: movie?.castingShort?.directors,
    })
  }

  res.json({
    movie,
    tmdbInfo,
  })
})

/* GET movies/:movieid */
router.get('/search/:term', async (req, res, _next) => {
  const { term } = req.params
  const { page = 1 } = req.query

  const movies = await Movie.search(term)
    .limit(25)
    .skip(25 * (Number(page) - 1))
    .populate('showtimes pastShowtimeCount')

  res.json({
    movies,
  })
})

router.use('/:movieIdOrSlug', getMovie, relationshipRoutes)

export default router
