const { Schema, model, SchemaTypes } = require('mongoose')
const { convertToSlug } = require('../utils/slug')

const castingShortSchema = new Schema({
  directors: String,
  actors: String,
})

const movieSchema = new Schema({
  allocineId: Number,
  title: String,
  poster: String,
  synopsis: String,
  runtime: Number,
  castingShort: castingShortSchema,
  releaseDate: { type: Schema.Types.Date },
  slug: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
})

const getUniqueSlugForMovie = async (movie) => {
  const slug = convertToSlug(movie.title)

  const moviesWithSameSlug = await Movie.find({ slug })
  if (moviesWithSameSlug.length === 0) {
    // slug is unique
    return slug
  }

  return convertToSlug(`${movie.title} ${movie.allocineId}`)
}

movieSchema.pre('validate', async function () {
  if (!this.slug) {
    console.log('Movie validator:', this)
    this.slug = await getUniqueSlugForMovie(this)
    console.log(this.slug)
  }
})

const Movie = model('Movie', movieSchema)

Movie.getUniqueSlugForMovie = getUniqueSlugForMovie

module.exports = Movie
