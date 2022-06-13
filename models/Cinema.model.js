const { Schema, model, SchemaTypes } = require('mongoose')
const { convertToSlug } = require('../utils/slug')

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
})

const Cinema = model('Cinema', cinemaSchema)

module.exports = Cinema
