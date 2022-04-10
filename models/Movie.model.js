const { Schema, model } = require('mongoose')

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
})

const Movie = model('Movie', movieSchema)

module.exports = Movie
