const router = require('express').Router()
import { isAuthenticated, includeUser } from '../../middleware/jwt.middleware'
import FavouriteCinema from '../../models/FavouriteCinema.model'

router.use(isAuthenticated, includeUser)

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
  const favourite = {
    cinema: req.params.cinemaId,
    user: req.user,
  }

  res.status(201).json(await like(favourite))
})

/* DELETE /api/likes/cinemas/:cinemaId */
router.delete('/cinemas/:cinemaId', async (req, res, next) => {
  const favourite = {
    cinema: req.params.cinemaId,
    user: req.user,
  }

  await unlike(favourite)

  res.status(204).send()
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

export default router
