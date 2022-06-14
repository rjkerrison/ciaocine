const Calendar = require('../../models/Calendar.model')

const deleteAllCalendars = async () => {
  const calendars = await Calendar.deleteMany()
  console.log('Finished.')
  console.log(calendars)
}

module.exports = {
  deleteAllCalendars,
}
