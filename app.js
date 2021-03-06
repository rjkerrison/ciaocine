// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config')

async function startApp() {
  console.log('Opening database connection…')
  // ℹ️ Connects to the database
  const db = await require('./db')

  // Handles http requests (express is node js framework)
  // https://www.npmjs.com/package/express
  const express = require('express')

  const app = express()

  // ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
  require('./config')(app)

  app.locals.appTitle = `Ciaocine`
  app.locals.pageTitle = `Home`
  app.locals.pageSubtitle = `Find cinema screenings in Paris`

  require('./routes')(app)

  // ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
  require('./error-handling')(app)

  return app
}

module.exports = startApp
