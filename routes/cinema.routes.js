const { getShowtimes } = require('../api/allocine')
const Cinema = require('../models/Cinema.model')
const FavouriteCinema = require('../models/FavouriteCinema.model')

const router = require('express').Router()

/* GET home page */
router.get('/', async (req, res, next) => {
  const cinemas = await Cinema.find()
  res.render('cinema', { cinemas })
})

/* GET single cinema view page */
router.get('/:id', async (req, res, next) => {
  try {
    let cinema = await Cinema.findById(req.params.id)
    const showtimes = await getShowtimes(cinema.allocine_id)

    if (req.session.user) {
      const liked =
        (await FavouriteCinema.count({
          cinema: cinema._id,
          user: req.session.user._id,
        })) > 0
      cinema = { liked, ...cinema._doc }
    }

    res.render('cinema/view', { cinema, showtimes })
  } catch (error) {
    next(error)
  }
})

module.exports = router
