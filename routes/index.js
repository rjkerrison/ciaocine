const index = require('./index.routes')
const apiRouter = require('./api')

const registerRoutes = (app) => {
  // Two base routes for compatibility
  app.use('/api', apiRouter)
  app.use('/', apiRouter)
  // Contains a redirect to the real homepage
  app.use('/', index)
}

module.exports = registerRoutes
