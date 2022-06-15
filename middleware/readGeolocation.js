const { getLocation } = require('../api/geocode')
const { latLonToPoint } = require('../models/schemas/geolocation')

const readGeolocation = async (req, res, next) => {
  const { q, lat, lon } = req.query
  if (!q && !(lat && lon)) {
    res.status(401).json({
      message: `Please provide 'lat' and 'lon' coordinates, or a geolocation search term 'q'.`,
    })
    return
  }

  const geolocation =
    lat && lon ? await latLonToPoint({ lat, lon }) : await getLocation(q)

  if (!geolocation) {
    res.status(400).json({ message: `Unknown geolocation: ${q}` })
    return
  }

  req.geolocation = geolocation
  next()
}

module.exports = {
  readGeolocation,
}
