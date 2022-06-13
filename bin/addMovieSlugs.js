require('dotenv/config')

const { default: mongoose } = require('mongoose')
const Movie = require('../models/Movie.model')
const { convertToSlug } = require('../utils/slug')

const seedMovieSlugs = async () => {
  await require('../db/index')

  // Find movies without slugs
  const movies = await Movie.find({
    $or: [{ slug: { $exists: 0 } }, { slug: /--/ }, { slug: /-$/ }],
  })
  console.log('Found %s movies without slugs.', movies.length)

  for (let movie of movies) {
    movie.slug = await getUniqueMovieSlug(movie)
    const updatedMovie = await movie.save()
    console.log('Updated movie:', updatedMovie)
  }

  console.log(`Updated ${movies.length} movies.`)

  // Let's create indexes
  await Movie.init()

  return await mongoose.connection.close()
}

async function getUniqueMovieSlug(movie) {
  const slug = convertToSlug(movie.title)
  const count = await Movie.count({ slug: { $regex: slug } })
  if (count === 0) {
    // slug is unique
    return slug
  }

  console.log({ type: 'duplication', ...movie })

  // make it unique by adding a number to the end
  return convertToSlug(`${movie.title} ${count + 1}`)
}

// TODO
// I have a problem with duplicate movies,
// e.g. 132355 is duplicated three times locally

seedMovieSlugs()
