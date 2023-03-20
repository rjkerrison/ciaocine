import Movie from '../../models/Movie.model'

const deleteAllMovies = async () => {
  const movies = await Movie.deleteMany()
  console.log('Finished.')
  console.log(movies)
}

export { deleteAllMovies }
