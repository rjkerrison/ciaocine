interface additionalPointInfo {
  displayName: String
  placeId: Number
  osmId: Number
}

interface geoPoint {
  type: String
  coordinates: [Number]
}

declare const point: geoPoint & additionalPointInfo

declare function latLonToPoint(
  _: { lat: Number; lon: Number } & additionalPointInfo
): point

export = {
  point,
  latLonToPoint,
}
