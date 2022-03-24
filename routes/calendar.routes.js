const isLoggedIn = require('../middleware/isLoggedIn')
const Calendar = require('../models/Calendar.model')
const Showtime = require('../models/Showtime.model')

const router = require('express').Router()

/* POST /calendar */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { code } = req.body
    const userId = req.user._id

    const showtime = await Showtime.findOne({ allocineId: code })
    const calendarEntry = {
      user: userId,
      showtime: showtime.id,
    }
    // no need to add things twice – so we do an "upsert"
    const calendar = await Calendar.findOneAndUpdate(
      calendarEntry,
      calendarEntry,
      { upsert: true }
    )

    res.json(calendar)
  } catch (error) {
    next(error)
  }
})

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id

    const calendar = await Calendar.find({ user: userId }).populate({
      path: 'showtime',
      model: Showtime,
      populate: ['movie', 'cinema'],
    })

    const calendarByDay = calendar.reduce((dict, seance) => {
      const date = seance.showtime.startTime.toLocaleDateString('en-GB')
      if (!dict[date]) {
        dict[date] = []
      }
      seance.showtime.timeString =
        seance.showtime.startTime.startTime.toLocaleDateString('en-GB')
      dict[date].push(seance)
      return dict
    }, {})

    res.render('calendar', { calendarByDay })
  } catch (error) {
    next(error)
  }
})

module.exports = router
