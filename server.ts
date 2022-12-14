import startApp from './app'
import { openConnection } from './db'
import { PORT } from './utils/consts'

const startServer = async () => {
  // First, we open the database connection
  const dbConnection = await openConnection()
  // We create the app
  const app = await startApp()

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Express server closed')
    })
    dbConnection.close(() => {
      console.log('Database connection closed')
    })
  })
}

startServer()
