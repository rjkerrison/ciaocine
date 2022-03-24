const isLoggedIn = require('../middleware/isLoggedIn')

const router = require('express').Router()

/* POST /calendar */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { code } = req.body
    const userId = req.user._id

    res.json({ code, user: userId })
  } catch (error) {
    next(error)
  }
})

module.exports = router
