const router = require('express').Router()
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const mongoose = require('mongoose')
const { isAuthenticated } = require('../../middleware/jwt.middleware')
const User = require('../../models/User.model')
const { createUser } = require('../helpers/user')

router.post('/signup', async (req, res) => {
  const { username, password, profilePictureUrl } = req.body

  if (!username) {
    return res.status(400).json({
      errorMessage: 'Please provide your username.',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: 'Your password needs to be at least 8 characters long.',
    })
  }

  const foundUser = await User.findOne({ username })
  if (foundUser) {
    return res.status(400).json({ errorMessage: 'Username already taken.' })
  }
  try {
    const user = await createUser({
      username,
      profilePictureUrl,
      password,
    })
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ errorMessage: error.message })
    }
    if (error.code === 11000) {
      return res.status(400).json({
        errorMessage:
          'Username need to be unique. The username you chose is already in use.',
      })
    }
    return res.status(500).json({ errorMessage: error.message })
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({
      errorMessage: 'Please provide your username.',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: 'Your password needs to be at least 8 characters long.',
    })
  }
  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        errorMessage: 'Wrong credentials.',
      })
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) {
      return res.status(400).json({
        errorMessage: 'Wrong credentials.',
      })
    }

    const payload = { username }

    const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1h',
    })

    return res.status(200).json({ authToken })
  } catch (err) {
    return res.status(500).json({ errorMessage: error.message })
  }
})

router.get('/verify', isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload)
})

module.exports = router
