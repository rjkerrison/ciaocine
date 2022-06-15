const { Schema, model, SchemaTypes } = require('mongoose')
const { findBySlugOrId } = require('../utils/findBySlugOrId')
const { convertToSlug } = require('../utils/slug')
const { point } = require('./schemas/geolocation')

const memberCardSchema = new Schema({
  code: Number,
  label: String,
})

const cinemaSchema = new Schema({
  allocine_id: String,
  name: String,
  address: String,
  zipcode: String,
  city: String,
  member_cards: [memberCardSchema],
  slug: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
    default: function () {
      return convertToSlug(this.name)
    },
  },
  geolocation: {
    type: point,
    index: '2dsphere',
  },
})

const Cinema = model('Cinema', cinemaSchema)
Cinema.findBySlugOrId = (slugOrId) => findBySlugOrId(Cinema, slugOrId)

module.exports = Cinema
