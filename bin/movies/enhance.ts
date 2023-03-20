import { HydratedDocument } from 'mongoose'
import Movie, { MovieSchema } from '../../models/Movie.model'
import { sleep } from '../helpers'
import { getMovieInfo } from '../../api/allocine'

const enhanceMovies = async () => {
  await Movie.init()
  const movies = await Movie.find()
  console.log('Found %s movies.', movies.length)

  const filteredMovies = movies.filter(
    (movie) => !(movie.releaseDate && movie.originalTitle)
  )

  for (let movie of filteredMovies) {
    // Attempt to do a little rate limiting
    await sleep(250)
    await enhanceMovie(movie)
  }

  console.log(`Updated ${filteredMovies.length} movies.`)
  console.log(`Skipped ${movies.length - filteredMovies.length} movies.`)
}

const enhanceMovie = async (
  movie: HydratedDocument<MovieSchema | null, MovieSchema>
) => {
  try {
    const movieInfo = await getMovieInfo(movie.allocineId)
    movie.set(movieInfo)

    const updatedMovie = await movie.save()
    console.log(`Updated ${updatedMovie.title}.`)

    return updatedMovie
  } catch (e) {
    const error = e as Error
    console.error(`Error updating movie ${movie}.`, error.message)
    return
  }
}

export { enhanceMovies }
