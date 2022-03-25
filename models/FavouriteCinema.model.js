const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    cinema: { type: Schema.Types.ObjectId, ref: 'Cinema' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

const FavouriteCinema = model('FavouriteCinema', schema)

module.exports = FavouriteCinema
