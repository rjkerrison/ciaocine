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

  require('./config')(app)
  require('./routes')(app)
  require('./error-handling')(app)

  return app
}

module.exports = startApp
