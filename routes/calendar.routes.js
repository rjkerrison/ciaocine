const {
  getCalendarForUserGroupByDate,
} = require('../db/aggregations/calendar-by-date')
const isLoggedIn = require('../middleware/isLoggedIn')
const Calendar = require('../models/Calendar.model')
const Showtime = require('../models/Showtime.model')
const { formatDate } = require('../utils/formatDate')

const router = require('express').Router()

/* POST /calendar */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.body
    const userId = req.user._id

    const showtime = await Showtime.findById(id)

    if (!showtime) {
      res
        .status(400)
        .json({ error: 'The showtime does not exist', showtime: id })
    }

    const calendarEntry = {
      user: userId,
      showtime: showtime.id,
    }
    // no need to add things twice – so we do an "upsert"
    const calendar = await Calendar.findOneAndUpdate(
      calendarEntry,
      calendarEntry,
      { upsert: true, new: true }
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
    const calendarDays = await getCalendarForUserGroupByDate(req.user._id)
    const calendarByDay = Object.fromEntries(
      calendarDays.map(({ _id, showtimes }) => [_id, showtimes])
    )

    const profilePictureUrl =
      req.user.profilePictureUrl || 'https://www.fillmurray.com/200/200'

    res.render('calendar', {
      calendarByDay,
      profilePictureUrl,
      pageTitle: 'Your calendar',
    })
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
  seance.showtime

  const date = seance.showtime.startTime.toLocaleDateString('en-GB')
  if (!dict[date]) {
    dict[date] = []
  }

  seance.showtime.timeString = formatDate(seance.showtime.startTime, {
    hour: 'numeric',
    minute: 'numeric',
  })
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
