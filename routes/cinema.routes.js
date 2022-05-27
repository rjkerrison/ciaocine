const { getMovies, getUrls } = require('./helpers/movies')
const Cinema = require('../models/Cinema.model')
const FavouriteCinema = require('../models/FavouriteCinema.model')
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
  cinema.liked = liked
  return cinema
}

/* GET home page */
router.get('/', async (req, res, next) => {
  let cinemas = await Cinema.find()
  if (req.session.user) {
    const likedCinemas = await getUserLikedCinemas(req.session.user._id)
    cinemas = cinemas.map((c) => addLikedToCinema(likedCinemas, c))
    cinemas.sort((a, b) => b.liked - a.liked)
    console.log({ cinema: cinemas[0], likedCinemas })
  }
  res.render('cinema', { cinemas, pageTitle: 'Cinemas' })
})

/* GET single cinema view page */
router.get('/:id', async (req, res, next) => {
  try {
    const { fromDate, toDate } = getDateParams(req.query)
    let cinema = await Cinema.findById(req.params.id)
    const movies = await getMovies({
      ...req.query,
      cinema: cinema.id,
      fromDate,
      toDate,
    })

    if (req.session.user) {
      const likedCinemas = await getUserLikedCinemas(req.session.user._id)
      cinema = addLikedToCinema(likedCinemas, cinema)
    }

    res.render('cinema/view', {
      cinema,
      movies,
      ...getUrls({ ...req.query, date: fromDate, url: `/cinema/${cinema.id}` }),
      showDate: true,
    })
  } catch (error) {
    console.error('ERROR OCCURRED IN CINEMA ROUTE')
    next(error)
  }
})

module.exports = router
