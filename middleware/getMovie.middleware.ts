import { RequestHandler } from 'express'
import Movie from '../models/Movie.model'

const getMovie: RequestHandler = async (req, res, next) => {
  const movie = await Movie.findBySlugOrId(req.params.movieIdOrSlug)

  if (movie === null) {
    res.status(404).json({ error: 'movie not found' })
    return
  }

  req.movie = movie
  next()
}

export default getMovie
