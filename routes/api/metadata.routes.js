const router = require('express').Router()
const {
  isAuthenticated,
  includeUser,
} = require('../../middleware/jwt.middleware')
const Movie = require('../../models/Movie.model')
const { Watch, Dismiss, Want } = require('../../models/UserMovieRelationship')
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
  console.log(foundMovies.map((x) => x._id))

  // Parallelise these three searches.
  const [watches, dismisses, wants] = await Promise.all(
    [Watch, Dismiss, Want].map((model) =>
      getSlugsForRelationship(model, foundMovies, user._id)
    )
  )

  res.json({
    username: user.username,
    movies,
    watches,
    dismisses,
    wants,
  })
})

const getSlugsForRelationship = async (model, foundMovies, userId) => {
  const foundRelationships = await model
    .find({
      user: userId,
      movie: { $in: foundMovies },
    })
    .select('movie')
    .populate({
      path: 'movie',
      options: {
        select: 'slug',
      },
    })

  return foundRelationships.map(({ movie: { slug } }) => slug)
}

module.exports = router
