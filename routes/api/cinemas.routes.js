const { isValidObjectId } = require('mongoose')
const router = require('express').Router()
const { getMovies } = require('../helpers/movies')
const { getDateParams } = require('../helpers/dates')
const Cinema = require('../../models/Cinema.model')

/* GET /api/cinemas */
router.get('/', async (req, res, next) => {
  let cinemas = await Cinema.find()
  res.status(200).json({ cinemas })
})

/* GET /api/cinemas/:cinemaId */
router.get('/:cinemaIdOrSlug', async (req, res, next) => {
  try {
    const { fromDate, toDate } = getDateParams(req.query)
    const cinema = isValidObjectId(req.params.cinemaIdOrSlug)
      ? await Cinema.findById(req.params.cinemaIdOrSlug)
      : await Cinema.findOne({ slug: req.params.cinemaIdOrSlug })

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

module.exports = router
