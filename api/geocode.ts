import axios from 'axios'
import { PointSchema } from '../models/schemas/geolocation'

const baseUrl = 'https://geocode.maps.co'

const getSearchConfig = (q) => {
  console.log(q)

  return {
    baseURL: baseUrl,
    url: '/search',
    params: {
      q,
    },
  }
}

const getLocation = async (...qs: string[]): Promise<PointSchema | null> => {
  if (qs.length === 0) {
    // could not find anything
    return null
  }

  const q = qs.shift()
  const response = await axios(getSearchConfig(q))

  console.log(response.data)

  if (response.data.length > 0) {
    return convertGeocodeToLocation(response.data[0])
  }

  // try with the next available query
  return await getLocation(...qs)
}

function convertGeocodeToLocation({
  lat,
  lon,
  display_name: displayName,
  place_id: placeId,
  osm_id: osmId,
}): PointSchema {
  return {
    type: 'Point',
    coordinates: [parseFloat(lat), parseFloat(lon)],
    displayName,
    placeId,
    osmId,
  }
}

export { getLocation }
