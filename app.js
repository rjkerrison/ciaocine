// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config')

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

const app = express()

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)

const capitalized = require('./utils/capitalized')
const projectName = 'ciaocine'

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`

// 👇 Start handling routes here
const index = require('./routes/index.routes')
app.use('/', index)

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)
const cinemaRoutes = require('./routes/cinema.routes')
app.use('/cinema', cinemaRoutes)
const calendarRoutes = require('./routes/calendar.routes')
app.use('/calendar', calendarRoutes)
const favouriteRoutes = require('./routes/favourite.routes')
app.use('/favourite', favouriteRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)
// Handle the handlebars setup
require('./config/handlebars')

module.exports = app
