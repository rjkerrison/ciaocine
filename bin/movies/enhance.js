const Movie = require('../../models/Movie.model')
const { sleep } = require('../helpers')
const { getMovieInfo } = require('../../api/allocine')

const enhanceMovies = async () => {
  const movies = await Movie.find()
  console.log('Found %s movies.', movies.length)

  for (let movie of movies) {
    if (movie.releaseDate) {
      console.log('Skipping %s, released %s', movie.title, movie.releaseDate)
      continue
    }

    // Attempt to do a little rate limiting
    await sleep(250)
    const result = await enhanceMovie(movie)
    console.log('Found info:', result)
  }

  console.log(`Updated ${movies.length} movies.`)
}

const enhanceMovie = async (movie) => {
  try {
    const movieInfo = await getMovieInfo(movie.allocineId)
    await movie.update({ ...movie._doc, ...movieInfo })
    const updatedMovie = await movie.save({ new: true })

    return updatedMovie
  } catch (error) {
    console.error(`Error updating movie ${movie}.`, error)
    return
  }
}

module.exports = {
  enhanceMovies,
}
