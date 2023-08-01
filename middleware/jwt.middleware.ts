import { Request, RequestHandler } from 'express'
import jwt from 'express-jwt'
import { ALGORITHM } from '../config/jwt'
import User from '../models/User.model'

const isAuthenticated: RequestHandler = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: [ALGORITHM],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
})

// Function used to extracts the JWT token from the request's 'Authorization' Headers
// Authorization: Bearer <JWT>

function getTokenFromHeaders(req: Request) {
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

const includeUser: RequestHandler = async (req, res, next) => {
  const { username } = req.payload
  const user = await User.findOne({ username })

  if (user === null) {
    res.status(401).json({ error: 'User credentials not found' })
    return
  }

  req.user = user
  next()
}

export { isAuthenticated, includeUser }
