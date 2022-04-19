const { Schema } = require('mongoose')
const Movie = require('./Movie.model')
const Cinema = require('./Cinema.model')

const linkSchema = new Schema({
  source: {
    type: String,
    enum: ['TMDB', 'Allocine'],
    required: true,
  },
  externalId: { type: Schema.Types.String, required: true },
  confirmed: { type: Schema.Types.Boolean, default: false },
  // A number 0-100 used for ordering multiple possible links
  likelihood: { type: Schema.Types.Number, default: 50 },
})

const movieLinkSchema = new Schema({
  movie: { type: Schema.Types.ObjectId, ref: Movie, required: true },
})

const cinemaLinkSchema = new Schema({
  cinema: { type: Schema.Types.ObjectId, ref: Cinema, required: true },
})

const ExternalLink = mongoose.model('Link', linkSchema)
const ExternalMovieLink = Link.discriminator('movie', movieLinkSchema)
const ExternalCinemaLink = Link.discriminator('cinema', cinemaLinkSchema)

module.exports = {
  ExternalLink,
  ExternalMovieLink,
  ExternalCinemaLink,
}
