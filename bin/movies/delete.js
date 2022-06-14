const Movie = require('../../models/Movie.model')

const deleteAllMovies = async () => {
  const movies = await Movie.deleteMany()
  console.log('Finished.')
  console.log(movies)
}

module.exports = {
  deleteAllMovies,
}
