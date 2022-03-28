const hbs = require('hbs')
const {
  formatDate,
  timeFormat,
  dateFormat,
  weekdayDateFormat,
} = require('../utils/formatDate')

hbs.registerPartials('views/partials')

hbs.registerHelper('time', (datetime) => formatDate(datetime, timeFormat))
hbs.registerHelper('date', (datetime) => formatDate(datetime, dateFormat))
hbs.registerHelper('weekdaydate', (datetime) =>
  formatDate(datetime, weekdayDateFormat)
)
