const { Schema, model } = require('mongoose')

const schema = new Schema({
  movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
  cinema: { type: Schema.Types.ObjectId, ref: 'Cinema' },
  startTime: { type: Schema.Types.Date },
  allocineId: String,
})

const Showtime = model('Showtime', schema)

module.exports = Showtime
