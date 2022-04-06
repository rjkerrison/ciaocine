const getShowtimesForCinemaGroupByMovie = require('../db/aggregations/showtimes-by-movie')
const Cinema = require('../models/Cinema.model')
const FavouriteCinema = require('../models/FavouriteCinema.model')
const { getCalendarUrls } = require('./helpers/cinema')
const { getDateParams } = require('./helpers/dates')

const router = require('express').Router()

const getUserLikedCinemas = async (userId) => {
  const cinemas = await FavouriteCinema.find({
    user: userId,
  })
  return cinemas.map((x) => x.cinema)
}

const addLikedToCinema = (likedCinemas, cinema) => {
  const liked = likedCinemas.some((lc) => lc.equals(cinema.id))
  return { liked, ...cinema._doc }
}

/* GET home page */
router.get('/', async (req, res, next) => {
  let cinemas = await Cinema.find()
  if (req.session.user) {
    const likedCinemas = await getUserLikedCinemas(req.session.user._id)
    cinemas = cinemas.map((c) => addLikedToCinema(likedCinemas, c))
    console.log({ cinema: cinemas[0], likedCinemas })
  }
  res.render('cinema', { cinemas, pageTitle: 'Cinemas' })
})

/* GET single cinema view page */
router.get('/:id', async (req, res, next) => {
  try {
    const { fromDate, toDate } = getDateParams(req.query)
    let cinema = await Cinema.findById(req.params.id)

    const movies = await getShowtimesForCinemaGroupByMovie(cinema.id, {
      fromDate,
      toDate,
    })

    if (req.session.user) {
      const likedCinemas = await getUserLikedCinemas(req.session.user._id)
      cinema = addLikedToCinema(likedCinemas, cinema)
    }

    res.render('cinema/view', {
      calendarUrls: getCalendarUrls({
        date: new Date(),
        ...req.params,
        ...req.query,
      }),
      cinema,
      movies,
      showDate: true,
    })
  } catch (error) {
    console.error('ERROR OCCURRED IN CINEMA ROUTE')
    next(error)
  }
})

module.exports = router
