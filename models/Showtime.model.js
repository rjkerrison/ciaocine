const { Schema, model } = require('mongoose')

const externalIdSchema = new Schema({
  id: {
    type: Schema.Types.String,
    required: true,
  },
  source: {
    type: Schema.Types.String,
    enum: ['allocine', 'mk2'],
  },
})

const schema = new Schema(
  {
    movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    cinema: { type: Schema.Types.ObjectId, ref: 'Cinema' },
    startTime: { type: Schema.Types.Date },
    allocineId: String,
    externalIds: [externalIdSchema],
  },
  {
    timestamps: true,
  }
)

const Showtime = model('Showtime', schema)

module.exports = Showtime
