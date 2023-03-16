import { InferSchemaType, SchemaTypes } from 'mongoose'

import { Schema, model } from 'mongoose'

const externalIdSchema = new Schema({
  id: {
    type: SchemaTypes.String,
    required: true,
  },
  source: {
    type: SchemaTypes.String,
    enum: ['allocine', 'mk2'],
  },
})

const schema = new Schema(
  {
    movie: { type: SchemaTypes.ObjectId, ref: 'Movie' },
    cinema: { type: SchemaTypes.ObjectId, ref: 'Cinema' },
    startTime: { type: SchemaTypes.Date },
    allocineId: SchemaTypes.String,
    externalIds: [externalIdSchema],
  },
  {
    timestamps: true,
  }
)

export type ShowtimeSchema = InferSchemaType<typeof schema>

const Showtime = model('Showtime', schema)

export default Showtime
