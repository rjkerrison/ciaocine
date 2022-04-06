const adjustDateByDays = (date, days) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const getDateHour = (d, hour) => {
  const date = new Date(d)
  date.setHours(hour)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

const getDateParams = ({ date = new Date(), fromHour = 0, toHour = 24 }) => {
  const fromDate = getDateHour(date, fromHour)
  const toDate = getDateHour(date, toHour)
  return {
    fromDate,
    toDate,
  }
}

module.exports = { adjustDateByDays, getDateParams }
