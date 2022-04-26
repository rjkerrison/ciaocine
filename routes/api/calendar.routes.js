const {
  isAuthenticated,
  includeUser,
} = require('../../middleware/jwt.middleware')
const {
  getCalendarForUserGroupByDate,
} = require('../../db/aggregations/calendar-by-date')
const Calendar = require('../../models/Calendar.model')
const Showtime = require('../../models/Showtime.model')

const router = require('express').Router()

router.use(isAuthenticated)
router.use(includeUser)

/* POST /api/calendar */
router.post('/', async (req, res, next) => {
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

/*
DELETE /api/calendar/:showtimeId

It is necessary to search by showtimeId and userId
to prevent users from removing others' calendar
entries simply by specifying an existing id.
*/
router.delete('/:showtimeId', async (req, res, next) => {
  try {
    const { showtimeId: showtime } = req.params
    const { _id: user } = req.user
    const deletion = await Calendar.findOneAndDelete({ showtime, user })

    res.json(deletion)
  } catch (error) {
    next(error)
  }
})

/* GET /api/calendar/ */
router.get('/', async (req, res, next) => {
  try {
    const calendarDays = await getCalendarForUserGroupByDate(req.user._id)
    const calendarByDay = calendarDays.map(({ _id, showtimes }) => ({
      calendarDate: new Date(_id),
      showtimes,
    }))

    res.json({
      calendar: calendarByDay,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router