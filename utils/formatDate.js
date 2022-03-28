const formatDate = (datetime, targetFormat) => {
  try {
    let { format } = Intl.DateTimeFormat('fr-FR', targetFormat)
    return format(datetime)
  } catch (error) {
    console.error('uhohohohoh', datetime)
    return datetime
  }
}

const timeFormat = {
  hour: 'numeric',
  minute: 'numeric',
}

const dateFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const weekdayDateFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}

const shortDateFormat = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

module.exports = {
  formatDate,
  timeFormat,
  dateFormat,
  shortDateFormat,
  weekdayDateFormat,
}
