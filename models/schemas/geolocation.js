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

const latLonToPoint = ({ lat, lon, ...other }) => {
  return {
    type: 'Point',
    coordinates: [lat, lon],
    ...other,
  }
}

module.exports = {
  point,
  latLonToPoint,
}
