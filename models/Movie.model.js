const { Schema, model, SchemaTypes } = require('mongoose')

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
    default: function () {
      return convertToSlug(this.title)
    },
  },
})

const Movie = model('Movie', movieSchema)

module.exports = Movie
