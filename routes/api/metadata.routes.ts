const router = require('express').Router()
import { isAuthenticated, includeUser } from '../../middleware/jwt.middleware'
import Movie from '../../models/Movie.model'
import { Watch, Dismiss, Want } from '../../models/UserMovieRelationship'
import { findBySlugs } from '../../utils/findBySlugOrId'

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
  const ids = foundMovies.map((x) => x._id)

  // Parallelise these three searches.
  const [watches, dismisses, wants] = await Promise.all(
    [Watch, Dismiss, Want].map((model) =>
      getSlugsForRelationship(model, ids, user._id)
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

export default router
