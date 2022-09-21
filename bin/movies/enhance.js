const Movie = require('../../models/Movie.model')
const { sleep } = require('../helpers')
const { getMovieInfo } = require('../../api/allocine')

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
    // console.log('Found info:', result)
  }

  console.log(`Updated ${filteredMovies.length} movies.`)
  console.log(`Skipped ${movies.length - filteredMovies.length} movies.`)
}

const enhanceMovie = async (movie) => {
  try {
    const movieInfo = await getMovieInfo(movie.allocineId)
    movie.set(movieInfo)

    const updatedMovie = await movie.save({ new: true })
    console.log(`Updated ${updatedMovie.title}.`)

    return updatedMovie
  } catch (error) {
    console.error(`Error updating movie ${movie}.`, error.message)
    return
  }
}

module.exports = {
  enhanceMovies,
}
