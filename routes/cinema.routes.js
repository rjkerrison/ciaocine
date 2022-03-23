const Cinema = require('../models/Cinema.model')

const router = require('express').Router()

/* GET home page */
router.get('/', async (req, res, next) => {
  const cinemas = await Cinema.find()
  res.render('cinema', { cinemas })
})

/* GET single cinema view page */
router.get('/:id', async (req, res, next) => {
  try {
    const cinema = await Cinema.findById(req.params.id)
    console.log(cinema)

    res.render('cinema/view', { cinema })
  } catch (error) {
    next(error)
  }
})

module.exports = router
