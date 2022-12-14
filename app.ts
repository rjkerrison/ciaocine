// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
import 'dotenv/config'

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
import express from 'express'
import config from './config'

async function startApp() {
  const app = express()

  config(app)
  require('./routes')(app)
  require('./error-handling')(app)

  return app
}

export default startApp
