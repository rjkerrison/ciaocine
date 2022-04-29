const index = require('./index.routes')
const apiRouter = require('./api')

const registerRoutes = (app) => {
  // Two base routes for compatibility
  app.use('/', apiRouter)
  app.use('/api', apiRouter)
  // Contains a redirect to the real homepage
  app.use('/', index)
}

module.exports = registerRoutes
