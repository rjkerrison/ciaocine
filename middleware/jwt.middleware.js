const jwt = require('express-jwt')
const { ALGORITHM } = require('../config/jwt')
const User = require('../models/User.model')

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: [ALGORITHM],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
})

// Function used to extracts the JWT token from the request's 'Authorization' Headers
// Authorization: Bearer <JWT>

function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(' ')[1]
    return token
  }

  return null
}

const includeUser = async (req, res, next) => {
  const { username } = req.payload
  const user = await User.findOne({ username })
  req.user = user
  next()
}

module.exports = {
  isAuthenticated,
  includeUser,
}
