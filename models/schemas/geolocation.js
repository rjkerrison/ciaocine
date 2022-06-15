const { Schema } = require('mongoose')

const point = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  displayName: String,
  placeId: Number,
  osmId: Number,
})

module.exports = {
  point,
}
