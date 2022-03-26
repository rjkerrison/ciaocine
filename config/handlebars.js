const hbs = require('hbs')

hbs.registerPartials('views/partials')

hbs.registerHelper('time', (datetime) => {
  let { format } = Intl.DateTimeFormat('fr-FR', {
    hour: 'numeric',
    minute: 'numeric',
  })
  return format(datetime)
})

hbs.registerHelper('date', (datetime) => {
  let { format } = Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return format(datetime)
})
