const Movie = require('../../models/Movie.model')

const addSlugsToMovies = async () => {
  // Find movies without slugs
  const movies = await Movie.find({
    $or: [{ slug: { $exists: 0 } }, { slug: /--/ }, { slug: /-$/ }],
  })
  console.log('Found %s movies without slugs.', movies.length)

  for (let movie of movies) {
    movie.slug = await Movie.getUniqueMovieSlug(movie)
    const updatedMovie = await movie.save()
    console.log('Updated movie:', updatedMovie)
  }

  console.log(`Updated ${movies.length} movies.`)

  // Let's create indexes
  await Movie.init()
}

module.exports = {
  addSlugsToMovies,
}
