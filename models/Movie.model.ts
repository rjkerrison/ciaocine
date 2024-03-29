import {
  InferSchemaType,
  Query,
  SchemaTypes,
  Schema,
  model,
  HydratedDocumentFromSchema,
  QueryWithHelpers,
  HydratedDocument,
} from 'mongoose'
import { findBySlugOrId } from '../utils/findBySlugOrId'
import { convertToSlug } from '../utils/slug'
import Showtime from './Showtime.model'
import { Want, Watch } from './UserMovieRelationship'

const castingShortSchema = new Schema({
  directors: SchemaTypes.String,
  actors: SchemaTypes.String,
})

export type CastingShort = InferSchemaType<typeof castingShortSchema>

export const movieSchema = new Schema(
  {
    allocineId: SchemaTypes.Number,
    title: SchemaTypes.String,
    originalTitle: SchemaTypes.String,
    poster: SchemaTypes.String,
    synopsis: SchemaTypes.String,
    runtime: SchemaTypes.Number,
    castingShort: castingShortSchema,
    releaseDate: { type: SchemaTypes.Date },
    slug: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    originalTitleSlug: {
      select: true,
      type: SchemaTypes.String,
      get: function (this: { originalTitle: string }) {
        return convertToSlug(this.originalTitle)
      },
    },
    externalIdentifiers: {
      letterboxd: {
        shortUrl: SchemaTypes.String,
        slug: SchemaTypes.String,
      },
      mk2: {
        id: SchemaTypes.String,
        slug: SchemaTypes.String,
      },
      tmdb: {
        id: SchemaTypes.String,
        title: SchemaTypes.String,
        originalTitle: SchemaTypes.String,
      },
    },
    images: {
      poster: {
        type: SchemaTypes.String,
      },
      backdrop: {
        type: SchemaTypes.String,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
)

export type MovieSchema = InferSchemaType<typeof movieSchema>

const getUniqueSlugForMovie = async (movie: MovieSchema) => {
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

// TODO replace searching with a search service which uses mapped keywords created on data change
const search = (term = ''): Query<MovieSchema[] | null, MovieSchema> => {
  const query = { $regex: term, $options: 'i' }

  return Movie.find({
    $or: searchableFields.map((field) => ({
      [field]: query,
    })),
  })
}

const searchableFields = [
  'title',
  'originalTitle',
  'castingShort.directors',
  'castingShort.actors',
  'externalIdentifiers.tmdb.title',
  'externalIdentifiers.tmdb.originalTitle',
]

type ExtendedMovie = typeof Movie & {
  getUniqueSlugForMovie: (movie: MovieSchema) => Promise<any>
  findBySlugOrId: (
    slugOrId: string
  ) => QueryWithHelpers<
    HydratedDocument<MovieSchema> | null,
    HydratedDocument<MovieSchema>
  >
  search: (term: string) => Query<MovieSchema[] | null, MovieSchema>
}

// This is silly. How do we extend a type nicely without destroying the original?
;(Movie as ExtendedMovie).getUniqueSlugForMovie = getUniqueSlugForMovie
;(Movie as ExtendedMovie).findBySlugOrId = (slugOrId: string) =>
  findBySlugOrId(Movie, slugOrId)
;(Movie as ExtendedMovie).search = search

export default Movie as ExtendedMovie
