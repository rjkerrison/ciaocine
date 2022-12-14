// We reuse this import in order to have access to the `body` property in requests
import express, { Express } from 'express'
import cors from 'cors'

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
import logger from 'morgan'

// Ensure models are known to mongoose
import './registerModels'

// Middleware configuration
export default (app: Express) => {
  // In development environment the app logs
  app.use(logger('dev'))

  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN?.split(',') || 'http://localhost:3000',
    })
  )

  // To have access to `body` property in the request
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.use((_req, _res, next) => {
    try {
      next()
    } catch (error) {
      next(error)
    }
  })
}
