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
    const movie = await Movie.findBySlugOrId(req.params.movieIdOrSlug)

    if (!movie) {
      res.status(404).json({ error: 'movie not found' })
      return
    }

    const showtimes = await Showtime.find({ movie: movie._id })
      .select('cinema startTime -_id')
      .sort({ startTime: -1 })
      .populate({
        path: 'cinema',
        select: 'name -_id',
      })

    res.json({
      movie,
      showtimes,
      tmdbInfo: await getMovies(movie.originalTitle, {
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
    const { year, director } = req.query
    const movies = await Movie.find({
      title: { $regex: term, $options: 'i' },
    })
    if (!movies) {
      res.status(404).json({ error: 'movie not found' })
      return
    }

    res.json({
      movies,
      tmdbInfo: await getMovies(term, { year, director }),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
