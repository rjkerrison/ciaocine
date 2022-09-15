const Movie = require('../models/Movie.model')

module.exports = async (req, res, next) => {
  const movie = await Movie.findBySlugOrId(req.params.movieIdOrSlug)

  if (!movie) {
    res.status(404).json({ error: 'movie not found' })
    return
  }

  req.movie = movie
  next()
}
