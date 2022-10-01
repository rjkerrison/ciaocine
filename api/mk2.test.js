require('dotenv/config')
const { createShowtimesForAllMk2Cinemas } = require('./mk2')

require('../db').then(async (connection) => {
  await createShowtimesForAllMk2Cinemas()
  await connection.close()
})
