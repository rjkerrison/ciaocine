const { Schema, model } = require('mongoose')

const movieSchema = new Schema({
  allocineId: Number,
  title: String,
  poster: String,
})

const Movie = model('Movie', movieSchema)

module.exports = Movie
