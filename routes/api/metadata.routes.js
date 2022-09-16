const router = require('express').Router()
const {
  isAuthenticated,
  includeUser,
} = require('../../middleware/jwt.middleware')
const Movie = require('../../models/Movie.model')
const { Watch } = require('../../models/UserMovieRelationship')
const { findBySlugs } = require('../../utils/findBySlugOrId')

router.use(isAuthenticated, includeUser)

// GET /metadata
// Allows for fetching metadata for a user:
// - films watched, wanted, or dismissed
// - cinemas liked
router.get('/', async (req, res, _next) => {
  const {
    user,
    query: { movies },
  } = req

  const foundMovies = await findBySlugs(Movie, movies)
  console.log(movies, foundMovies)

  const watches = await Watch.find({
    user: user._id,
    movie: { $in: foundMovies },
  })

  res.json({
    user,
    movies,
    watches,
  })
})

module.exports = router
