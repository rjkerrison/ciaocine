const { Schema, model } = require('mongoose')
const { findBySlugOrId } = require('../utils/findBySlugOrId')
const { convertToSlug } = require('../utils/slug')
const Showtime = require('./Showtime.model')
const { Want, Watch } = require('./UserMovieRelationship')

const castingShortSchema = new Schema({
  directors: String,
  actors: String,
})

const movieSchema = new Schema(
  {
    allocineId: Number,
    title: String,
    originalTitle: String,
    poster: String,
    synopsis: String,
    runtime: Number,
    castingShort: castingShortSchema,
    releaseDate: { type: Schema.Types.Date },
    slug: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    originalTitleSlug: {
      select: true,
      type: Schema.Types.String,
      get: function () {
        const slug = convertToSlug(this.originalTitle)
        console.log(this.originalTitle, slug)
        return slug
      },
    },
    externalIdentifiers: {
      letterboxd: {
        shortUrl: Schema.Types.String,
        slug: Schema.Types.String,
      },
      tmdb: {
        id: Schema.Types.String,
        title: Schema.Types.String,
        originalTitle: Schema.Types.String,
      },
    },
    images: {
      poster: {
        type: Schema.Types.String,
      },
      backdrop: {
        type: Schema.Types.String,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
)

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

movieSchema.virtual('showtimes', {
  ref: Showtime,
  localField: '_id',
  foreignField: 'movie',
  match: () => ({
    startTime: { $gte: new Date() },
  }),
  options: {
    projection: 'cinema startTime',
    sort: { startTime: 1 },
    populate: {
      path: 'cinema',
      select: 'name -_id',
    },
  },
})

movieSchema.virtual('pastShowtimeCount', {
  ref: Showtime,
  localField: '_id',
  foreignField: 'movie',
  match: () => ({
    startTime: { $lt: new Date() },
  }),
  count: true,
})

movieSchema.virtual('wantCount', {
  ref: Want,
  localField: '_id',
  foreignField: 'movie',
  count: true,
})

movieSchema.virtual('watchCount', {
  ref: Watch,
  localField: '_id',
  foreignField: 'movie',
  count: true,
})

const Movie = model('Movie', movieSchema)

Movie.getUniqueSlugForMovie = getUniqueSlugForMovie
Movie.findBySlugOrId = (slugOrId) => findBySlugOrId(Movie, slugOrId)

const searchableFields = [
  'title',
  'originalTitle',
  'castingShort.directors',
  'castingShort.actors',
  'externalIdentifiers.tmdb.title',
  'externalIdentifiers.tmdb.originalTitle',
]

// TODO replace searching with a search service which uses mapped keywords created on data change
Movie.search = (term = '') => {
  const query = { $regex: term, $options: 'i' }

  return Movie.find({
    $or: searchableFields.map((field) => ({
      [field]: query,
    })),
  })
}

module.exports = Movie
