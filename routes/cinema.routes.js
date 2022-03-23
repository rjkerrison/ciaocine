const Cinema = require('../models/Cinema.model')

const router = require('express').Router()

/* GET home page */
router.get('/', async (req, res, next) => {
  const cinemas = await Cinema.find()
  res.render('cinema', { cinemas })
})

module.exports = router
