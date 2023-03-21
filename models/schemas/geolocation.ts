import { InferSchemaType, Schema, SchemaTypes } from 'mongoose'

const point = new Schema({
  type: {
    type: SchemaTypes.String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [SchemaTypes.Number],
    required: true,
  },
  displayName: SchemaTypes.String,
  placeId: SchemaTypes.Number,
  osmId: SchemaTypes.Number,
})

export type PointSchema = InferSchemaType<typeof point>

interface LatLon {
  lat: string
  lon: string
}

const latLonToPoint = ({
  lat,
  lon,
  ...other
}: LatLon & Partial<PointSchema>): PointSchema => {
  return {
    type: 'Point',
    coordinates: [parseFloat(lat), parseFloat(lon)],
    ...other,
  }
}

export { point, latLonToPoint }
