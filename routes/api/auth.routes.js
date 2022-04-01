const router = require('express').Router()
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const mongoose = require('mongoose')
const { ALGORITHM } = require('../../config/jwt')
const { isAuthenticated } = require('../../middleware/jwt.middleware')
const User = require('../../models/User.model')
const { createUser, validateUserInputs } = require('../helpers/user')

const sendBadRequestResponse = (res, ...errorMessages) => {
  return res.status(400).json({
    errorMessages,
    // backwards compatibility
    errorMessage: errorMessages.join(' '),
  })
}

router.post('/signup', async (req, res, _next) => {
  const { username, password, profilePictureUrl, email } = req.body

  const validationErrors = Array.from(
    ...validateUserInputs({ username, email, password })
  )
  if (validationErrors.length > 0) {
    return sendBadRequestResponse(res, ...validationErrors)
  }

  const foundUser = await User.findOne({ $or: [{ username }, { email }] })
  if (foundUser) {
    const errorMessages = []
    if (foundUser.email === email) {
      errorMessages.push(`"${email}" already has an account.`)
    }
    if (foundUser.username === username) {
      errorMessages.push(`Username "${username}" is already taken.`)
    }

    return sendBadRequestResponse(res, ...errorMessages)
  }

  try {
    const user = await createUser({
      username,
      profilePictureUrl,
      password,
      email,
    })
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return sendBadRequestResponse(res, error.message)
    }
    if (error.code === 11000) {
      return sendBadRequestResponse(
        res,
        'Username needs to be unique. The username you chose is already in use.'
      )
    }
    return res.status(500).json({ errorMessage: error.message })
  }
})

router.post('/login', async (req, res, _next) => {
  const { username, password } = req.body

  if (!username) {
    return sendBadRequestResponse(res, 'Please provide your username.')
  }

  if (password.length < 8) {
    return sendBadRequestResponse(
      res,
      'Your password needs to be at least 8 characters long.'
    )
  }
  try {
    const foundUser = await User.findOne({ username }).select(
      '-_id password profilePictureUrl username'
    )

    if (!foundUser) {
      return sendBadRequestResponse(res, 'Wrong credentials.')
    }

    const { password: foundPassword, ...payload } = foundUser._doc
    const isCorrectPassword = await bcrypt.compare(password, foundPassword)

    if (!isCorrectPassword) {
      return sendBadRequestResponse(res, 'Wrong credentials.')
    }

    const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: ALGORITHM,
      expiresIn: '168h',
    })

    return res.status(200).json({ authToken })
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message })
  }
})

router.get('/verify', isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload)
})

module.exports = router
