import index from './index.routes'
import apiRouter from './api'

const registerRoutes = (app) => {
  // Two base routes for compatibility
  app.use('/api', apiRouter)
  app.use('/', apiRouter)
  // Contains a redirect to the real homepage
  app.use('/', index)
}

export default registerRoutes
