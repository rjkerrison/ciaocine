const hbs = require('hbs')
const {
  formatDate,
  timeFormat,
  dateFormat,
  dateMonthFormat,
  weekdayDateFormat,
} = require('../utils/formatDate')
const { getRandomPosterUrl } = require('./fakeposters')

hbs.registerPartials('views/partials')

hbs.registerHelper('time', (datetime) => formatDate(datetime, timeFormat))
hbs.registerHelper('date', (datetime) => formatDate(datetime, dateFormat))
hbs.registerHelper('dateMonth', (datetime) =>
  formatDate(datetime, dateMonthFormat)
)
hbs.registerHelper('weekdaydate', (datetime) =>
  formatDate(datetime, weekdayDateFormat)
)
hbs.registerHelper('ifGreaterThan', (v1, v2, options) => {
  'use strict'
  if (v1 > v2) {
    return options.fn(this)
  }
  return options.inverse(this)
})
hbs.registerHelper('stripProtocol', (url) => {
  if (!url) {
    console.error('URL was not provided')
    url = getRandomPosterUrl()
  }

  return url?.replace(/^http(s?):\/\//, '//')
})

hbs.registerHelper('eachSlice', function (array, start, end, options) {
  if (!array || array.length == 0) {
    return options.inverse(this)
  }

  const items = array.slice(start, end)
  const result = items.map((item) => options.fn(item))
  return result.join('')
})
