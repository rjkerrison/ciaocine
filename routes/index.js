// 👇 Start handling routes here
const index = require('./index.routes')
const authRoutes = require('./auth.routes')
const cinemaRoutes = require('./cinema.routes')
const calendarRoutes = require('./calendar.routes')
const favouriteRoutes = require('./favourite.routes')
const moviesRoutes = require('./movies.routes')

const registerRoutes = (app) => {
  app.use('/', index)
  app.use('/auth', authRoutes)
  app.use('/cinema', cinemaRoutes)
  app.use('/calendar', calendarRoutes)
  app.use('/favourite', favouriteRoutes)
  app.use('/movies', moviesRoutes)
}

module.exports = registerRoutes
