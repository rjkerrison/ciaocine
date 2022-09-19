const {
  isAuthenticated,
  includeUser,
} = require('../../middleware/jwt.middleware')
const { Watch, Dismiss, Want } = require('../../models/UserMovieRelationship')

const router = require('express').Router()

router.use(isAuthenticated, includeUser)

const upsertRelationship = async (relationshipModel, req, res) => {
  const relationship = await relationshipModel.findOneAndReplace(
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

const removeRelationship = async (relationshipModel, req, res) => {
  await relationshipModel.findOneAndDelete({
    user: req.user.id,
    movie: req.movie.id,
  })

  res.sendStatus(204)
}

router.post('/watch', (req, res, _next) => {
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

module.exports = router
