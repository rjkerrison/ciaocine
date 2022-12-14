const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/ciaocine'
const PORT = process.env.PORT || 3000
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`
const URL_SEPARATOR = '|'

module.exports = {
  MONGO_URI,
  APP_URL,
  PORT,
  URL_SEPARATOR,
}
