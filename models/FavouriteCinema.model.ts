import { Schema, model, SchemaTypes } from 'mongoose'

const schema = new Schema(
  {
    cinema: { type: SchemaTypes.ObjectId, ref: 'Cinema' },
    user: { type: SchemaTypes.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

const FavouriteCinema = model('FavouriteCinema', schema)

export default FavouriteCinema
