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

/* DELETE /calendar/:calendarId */
router.delete('/:calendarId', isLoggedIn, async (req, res, next) => {
  try {
    const deletion = await Calendar.findByIdAndDelete(req.params.calendarId)

    res.json(deletion)
  } catch (error) {
    next(error)
  }
})

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const calendarByDay = await getUserCalendarByDay(req.user._id)
    const profilePictureUrl =
      req.user.profilePictureUrl || 'https://www.fillmurray.com/200/200'

    res.render('calendar', { calendarByDay, profilePictureUrl })
  } catch (error) {
    next(error)
  }
})

const getUserCalendarByDay = async (userId) => {
  const calendar = await Calendar.find({ user: userId }).populate({
    path: 'showtime',
    model: Showtime,
    populate: ['movie', 'cinema'],
  })

  return calendar.reduce(groupByDay, {})
}

const groupByDay = (dict, seance) => {
  const date = seance.showtime.startTime.toLocaleDateString('en-GB')
  if (!dict[date]) {
    dict[date] = []
  }
  let { format } = Intl.DateTimeFormat('fr-FR', {
    hour: 'numeric',
    minute: 'numeric',
  })

  seance.showtime.timeString = format(seance.showtime.startTime)
  dict[date].push(seance)
  dict[date].sort(bySeanceTime)
  return dict
}

const bySeanceTime = (a, b) => {
  if (a.showtime.timeString > b.showtime.timeString) {
    return 1
  } else {
    return -1
  }
}

module.exports = router
