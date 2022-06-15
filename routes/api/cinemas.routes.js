const router = require('express').Router()
const { getMovies } = require('../helpers/movies')
const { getDateParams } = require('../helpers/dates')
const Cinema = require('../../models/Cinema.model')
const { getLocation } = require('../../api/geocode')
const { latLonToPoint } = require('../../models/schemas/geolocation')

/* GET /api/cinemas */
router.get('/', async (req, res, next) => {
  let cinemas = await Cinema.find()
  res.status(200).json({ cinemas })
})

/* GET /api/cinemas */
router.get('/nearby', async (req, res, next) => {
  try {
    const { q, lat, lon } = req.query
    if (!q && !(lat && lon)) {
      res.status(401).json({
        message: `Please provide 'lat' and 'lon' coordinates, or a location search term 'q'.`,
      })
      return
    }

    const location =
      lat && lon ? await latLonToPoint({ lat, lon }) : await getLocation(q)

    if (!location) {
      res.status(400).json({ message: `Unknown location: ${q}` })
      return
    }

    const cinemas = await Cinema.find({
      geolocation: { $near: { $geometry: location } },
    })
    res.status(200).json({ cinemas })
  } catch (error) {
    next(error)
  }
})

/* GET /api/cinemas/:cinemaId */
router.get('/:cinemaIdOrSlug', async (req, res, next) => {
  try {
    const { fromDate, toDate } = getDateParams(req.query)

    const cinema = await Cinema.findBySlugOrId(req.params.cinemaIdOrSlug)

    const movies = await getMovies({
      ...req.query,
      cinema: cinema._id,
      fromDate,
      toDate,
    })

    res.status(200).json({
      cinema,
      movies,
    })
  } catch (error) {
    next(error)
  }
})

router.get(
  '/:cinemaIdOrSlug/showtimes/:year/:month/:date',
  async (req, res, next) => {
    const cinema = await Cinema.findBySlugOrId(req.params.cinemaIdOrSlug)

    const { year, month, date } = req.params
    try {
      const { fromDate, toDate } = getDateParams({
        ...req.query,
        date: new Date(year, month - 1, date),
      })

      const movies = await getMovies({
        fromDate,
        toDate,
        cinema: cinema._id,
        ...req.query,
      })

      res.json({
        cinema,
        movies,
        fromDate,
        toDate,
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
