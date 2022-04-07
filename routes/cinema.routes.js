const getShowtimesForCinemaGroupByDate = require('../db/aggregations/showtimes-by-date')
const { getMovies, getUrls } = require('./helpers/movies')

const Cinema = require('../models/Cinema.model')
const FavouriteCinema = require('../models/FavouriteCinema.model')

const router = require('express').Router()

const getUserLikedCinemas = async (userId) => {
  const cinemas = await FavouriteCinema.find({
    user: userId,
  })
  return cinemas.map((x) => x.cinema)
}

const addLikedToCinema = (likedCinemas, cinema) => {
  const liked = likedCinemas.some((lc) => lc.equals(cinema.id))
  cinema.liked = liked
  return cinema
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
    let cinema = await Cinema.findById(req.params.id)
    const { movies, fromDate } = await getMovies({
      ...req.query,
      cinema: cinema.id,
    })

    if (req.session.user) {
      const likedCinemas = await getUserLikedCinemas(req.session.user._id)
      cinema = addLikedToCinema(likedCinemas, cinema)
    }

    console.log(fromDate)

    res.render('cinema/view', {
      cinema,
      movies,
      ...getUrls({ ...req.query, date: fromDate, url: `/cinema/${cinema.id}` }),
    })
  } catch (error) {
    console.error('ERROR OCCURRED IN CINEMA ROUTE')
    next(error)
  }
})

/* GET single cinema view page, sorted by date */
router.get('/:id/byDate', async (req, res, next) => {
  try {
    let cinema = await Cinema.findById(req.params.id)
    const movies = await getShowtimesForCinemaGroupByDate(cinema.id)

    if (req.session.user) {
      const likedCinemas = await getUserLikedCinemas(req.session.user._id)
      cinema = addLikedToCinema(likedCinemas, cinema)
    }

    res.render('cinema/viewByDate', { cinema, movies })
  } catch (error) {
    next(error)
  }
})

module.exports = router
