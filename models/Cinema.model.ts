import { Schema, model, SchemaTypes, InferSchemaType, Model } from 'mongoose'

import { findBySlugOrId } from '../utils/findBySlugOrId'
import { convertToSlug } from '../utils/slug'
import { point } from './schemas/geolocation'

const memberCardSchema = new Schema({
  code: Number,
  label: String,
})

const cinemaSchema = new Schema({
  allocine_id: SchemaTypes.String,
  name: SchemaTypes.String,
  address: SchemaTypes.String,
  zipcode: SchemaTypes.String,
  city: SchemaTypes.String,
  member_cards: [memberCardSchema],
  slug: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
    default: function (this: { name: string }) {
      return convertToSlug(this.name)
    },
  },
  geolocation: {
    type: point,
    index: '2dsphere',
  },
})

export type CinemaSchema = InferSchemaType<typeof cinemaSchema>

const Cinema: Model<CinemaSchema> & {
  findBySlugOrId?: Function
} = model('Cinema', cinemaSchema)

Cinema.findBySlugOrId = (slugOrId: string) => findBySlugOrId(Cinema, slugOrId)

export default Cinema
