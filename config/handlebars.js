const hbs = require('hbs')

hbs.registerPartials('views/partials')

const timeFormat = {
  hour: 'numeric',
  minute: 'numeric',
}

const dateFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const formatDate = (datetime, targetFormat) => {
  try {
    let { format } = Intl.DateTimeFormat('fr-FR', targetFormat)
    return format(datetime)
  } catch (error) {
    console.error('uhohohohoh', datetime)
    return datetime
  }
}

hbs.registerHelper('time', (datetime) => formatDate(datetime, timeFormat))
hbs.registerHelper('date', (datetime) => formatDate(datetime, dateFormat))
