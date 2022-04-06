const { APP_URL } = require('../../utils/consts')
const { formatDate, weekdayDateMonthFormat } = require('../../utils/formatDate')
const { adjustDateByDays } = require('./dates')
const { appendSearchParams } = require('./params')

const getDaysUrls = (options, step, count, classname) => {
  const dates = []
  options.date = new Date(options.date)

  for (let i = 1; i <= count; i++) {
    const date = adjustDateByDays(options.date, i * step)
    dates.push(date)
  }

  dates.sort((a, b) => a - b)
  const results = dates.map((date) => {
    const url = getCinemaUrl({
      ...options,
      date,
    })
    const label = formatDate(date, weekdayDateMonthFormat)

    return { url, label, class: classname }
  })
  return results
}

const getCalendarUrls = (options) => {
  return [
    ...getDaysUrls(options, -1, 3, 'expanded-only'),
    {
      url: getCinemaUrl(options),
      label: formatDate(options.date, weekdayDateMonthFormat),
      class: 'selected',
    },
    ...getDaysUrls(options, 1, 3, 'expanded-only'),
  ]
}

const getCinemaUrl = (params) => {
  let date
  try {
    date = params.date.toISOString()
  } catch {
    date = new Date(Date.now()).toISOString()
  }

  return appendSearchParams(new URL(`${APP_URL}/cinema/${params.id}`), {
    ...params,
    date,
  })
}

module.exports = { getCalendarUrls }
