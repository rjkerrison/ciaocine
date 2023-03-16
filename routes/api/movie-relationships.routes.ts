import { Model } from 'mongoose'
import { Router } from 'express'
import { isAuthenticated, includeUser } from '../../middleware/jwt.middleware'
import { Watch, Dismiss, Want } from '../../models/UserMovieRelationship'

const router = Router()

router.use(isAuthenticated, includeUser)

const upsertRelationship = async <T>(relationshipModel: Model<T>, req, res) => {
  const relationship = await relationshipModel.findOneAndUpdate(
    {
      user: req.user.id,
      movie: req.movie.id,
    },
    {
      ...req.body,
      user: req.user.id,
      movie: req.movie.id,
    },
    { new: true, upsert: true }
  )

  res.json({
    relationship,
  })
}

const removeRelationship = async <T>(relationshipModel: Model<T>, req, res) => {
  await relationshipModel.findOneAndDelete({
    user: req.user.id,
    movie: req.movie.id,
  })

  res.sendStatus(204)
}

router.post('/watch', (req, res, _next: any) => {
  upsertRelationship(Watch, req, res)
})

router.post('/dismiss', async (req, res, _next) => {
  upsertRelationship(Dismiss, req, res)
})

router.post('/want', async (req, res, _next) => {
  upsertRelationship(Want, req, res)
})

router.delete('/watch', async (req, res, _next) => {
  removeRelationship(Watch, req, res)
})

router.delete('/dismiss', async (req, res, _next) => {
  removeRelationship(Dismiss, req, res)
})

router.delete('/want', async (req, res, _next) => {
  removeRelationship(Want, req, res)
})

export default router
