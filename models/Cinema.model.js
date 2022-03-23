const { Schema, model } = require('mongoose')

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
})

const Cinema = model('Cinema', cinemaSchema)

module.exports = Cinema
