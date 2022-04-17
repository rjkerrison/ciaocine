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
router.get('/:movieId', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
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
      tmdbInfo: await getMovies(movie.title, movie?.releaseDate?.getFullYear()),
    })
  } catch (error) {
    next(error)
  }
})

/* GET movies/:movieid */
router.get('/search/:term', async (req, res, next) => {
  try {
    const { term } = req.params
    const movies = await Movie.find({
      title: { $regex: term, $options: 'i' },
    })
    if (!movies) {
      res.status(404).json({ error: 'movie not found' })
      return
    }

    res.json({
      movies,
      tmdbInfo: await getMovies(term),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
