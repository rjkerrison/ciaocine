const { getMovies } = require('../../api/tmdb')
const Movie = require('../../models/Movie.model')
const Showtime = require('../../models/Showtime.model')

const router = require('express').Router()

/* GET movies */
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find()

    res.json({
      movies,
    })
  } catch (error) {
    next(error)
  }
})

/* GET movies/:movieid */
router.get('/:movieIdOrSlug', async (req, res, next) => {
  try {
    const movie = await Movie.findBySlugOrId(req.params.movieIdOrSlug).populate(
      'showtimes pastShowtimeCount'
    )

    if (!movie) {
      res.status(404).json({ error: 'movie not found' })
      return
    }

    res.json({
      movie,
      tmdbInfo: await getMovies(movie.originalTitle || movie.title, {
        year: movie?.releaseDate?.getFullYear(),
        director: movie?.castingShort?.directors,
      }),
    })
  } catch (error) {
    next(error)
  }
})

/* GET movies/:movieid */
router.get('/search/:term', async (req, res, next) => {
  try {
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

    if (!movies) {
      res.status(404).json({ error: 'movie not found' })
      return
    }

    res.json({ movies })
  } catch (error) {
    next(error)
  }
})

module.exports = router
