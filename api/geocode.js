const { default: axios } = require('axios')

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

const getLocation = async (...qs) => {
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

module.exports = {
  getLocation,
}
function convertGeocodeToLocation(geocode) {
  const {
    lat,
    lon,
    display_name: displayName,
    place_id: placeId,
    osm_id: osmId,
  } = geocode

  return {
    type: 'Point',
    coordinates: [lat, lon],
    displayName,
    placeId,
    osmId,
  }
}
