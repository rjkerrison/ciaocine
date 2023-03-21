import { RequestHandler } from 'express'

import { getLocation } from '../api/geocode'
import { latLonToPoint, PointSchema } from '../models/schemas/geolocation'

const readGeolocation: RequestHandler = async (req, res, next) => {
  const { q, lat, lon } = req.query
  if (!q && !(lat && lon)) {
    res.status(401).json({
      message: `Please provide 'lat' and 'lon' coordinates, or a geolocation search term 'q'.`,
    })
    return
  }

  let geolocation: PointSchema | null = null
  if (typeof lat === 'string' && typeof lon === 'string') {
    geolocation = latLonToPoint({ lat, lon })
  } else {
    if (typeof q === 'undefined') {
      // do nothing
    } else if (typeof q === 'string') {
      geolocation = await getLocation(q)
    } else if (typeof q.length !== 'undefined') {
      // I don't like ParsedQs.
      // There's no easy way to identify that q is string[], and not ParsedQs | ParsedQs[].
      geolocation = await getLocation(...(q as string[]))
    }
  }

  if (!geolocation) {
    res.status(400).json({ message: `Unknown geolocation: ${q}` })
    return
  }

  req.geolocation = geolocation
  next()
}

export { readGeolocation }
