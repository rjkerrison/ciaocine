const router = require('express').Router()
const { isAuthenticated } = require('../../middleware/jwt.middleware')
const User = require('../../models/User.model')
const FavouriteCinema = require('../../models/FavouriteCinema.model')

router.use(isAuthenticated)
router.use(async (req, res, next) => {
  const { username } = req.payload
  const user = await User.findOne({ username })
  req.user = user
  next()
})

/* GET /api/likes/cinemas */
router.get('/cinemas', async (req, res, next) => {
  const cinemas = await FavouriteCinema.find({ user: req.user }).populate({
    path: 'cinema',
    select: 'name',
  })
  res.json({ cinemas })
})

/* POST /api/likes/cinemas/:cinemaId */
router.post('/cinemas/:cinemaId', async (req, res, next) => {
  try {
    const favourite = {
      cinema: req.params.cinemaId,
      user: req.user,
    }

    res.status(201).json(await like(favourite))
  } catch (error) {
    next(error)
  }
})

/* DELETE /api/likes/cinemas/:cinemaId */
router.delete('/cinemas/:cinemaId', async (req, res, next) => {
  try {
    const favourite = {
      cinema: req.params.cinemaId,
      user: req.user,
    }

    await unlike(favourite)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

const like = (favourite) => {
  return FavouriteCinema.findOneAndUpdate(favourite, favourite, {
    upsert: true,
    new: true,
  })
}
const unlike = (favourite) => {
  return FavouriteCinema.findOneAndDelete(favourite)
}

module.exports = router
