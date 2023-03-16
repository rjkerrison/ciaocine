// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
import 'dotenv/config'

import config from './config'
import registerRoutes from './routes'
import errorHandling from './error-handling'
import db from './db'
import express from 'express'

async function startApp() {
  console.log('Opening database connection…')

  // Handles http requests (express is node js framework)
  // https://www.npmjs.com/package/express
  const app = express()

  config(app)
  registerRoutes(app)
  errorHandling(app)

  // ℹ️ Connects to the database
  await db
  return app
}

export default startApp
