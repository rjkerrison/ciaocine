const router = require('express').Router()
const { getRandomShowtimePopulated } = require('../db/random-showtime')

/* GET home page */
router.get('/', async (req, res, next) => {
  const showtime = await getRandomShowtimePopulated()

  res.render('index', { showtime })
})

module.exports = router
