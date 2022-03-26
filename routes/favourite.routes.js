const isLoggedIn = require('../middleware/isLoggedIn')
const FavouriteCinema = require('../models/FavouriteCinema.model')
const router = require('express').Router()

/* POST /favourite/cinema/:cinema */
router.post('/cinema/:cinema', isLoggedIn, async (req, res, next) => {
  try {
    const { liked } = req.body
    const user = req.user._id
    const favourite = {
      cinema: req.params.cinema,
      user,
    }

    if (liked) {
      await like(favourite)
    } else {
      await unlike(favourite)
    }

    res.json({ liked })
  } catch (error) {
    next(error)
  }
})

const like = (favourite) => {
  return FavouriteCinema.findOneAndUpdate(favourite, favourite, {
    upsert: true,
  })
}
const unlike = (favourite) => {
  return FavouriteCinema.findOneAndDelete(favourite)
}

module.exports = router
