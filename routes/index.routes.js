const router = require('express').Router()

/* Redirect to the real site */
router.get('/', async (req, res, next) => {
  res.redirect('https://www.ciaocine.com')
})

module.exports = router
