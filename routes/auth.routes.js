const router = require('express').Router()

// ℹ️ Handles password encryption
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const fileUploader = require('../config/cloudinary.config')

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10

// Require the User model in order to interact with the database
const User = require('../models/User.model')

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')

router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup')
})

router.post(
  '/signup',
  isLoggedOut,
  fileUploader.single('profile-picture'),
  (req, res) => {
    const { username, password, email } = req.body
    const errorMessages = []

    if (!username) {
      errorMessages.push('Please provide your username.')
    }

    if (!email) {
      errorMessages.push('Please provide your email address.')
    }

    if (password.length < 8) {
      errorMessages.push(
        'Your password needs to be at least 8 characters long.'
      )
    }

    if (errorMessages.length > 0) {
      return sendBadRequestResponse(res, 'auth/signup', ...errorMessages)
    }

    // Search the database for a user with the username submitted in the form
    User.findOne({ $or: [{ username }, { email }] }).then((found) => {
      // If the user is found, send an appropriate message
      if (found) {
        if (found.email === email) {
          errorMessages.push(`"${email}" already has an account.`)
        }
        if (found.username === username) {
          errorMessages.push(`Username "${username}" is already taken.`)
        }

        return sendBadRequestResponse(res, 'auth/signup', ...errorMessages)
      }

      // if user is not found, create a new user - start with hashing the password
      return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          // Create a user and save it in the database
          return User.create({
            username,
            profilePictureUrl: req.file?.path,
            password: hashedPassword,
            email,
          })
        })
        .then((user) => {
          // Bind the user to the session object
          req.session.user = user
          res.redirect('/')
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            errorMessages.push(error.message)
            return sendBadRequestResponse(res, 'auth/signup', ...errorMessages)
          }
          if (error.code === 11000) {
            errorMessages.push(
              'Username need to be unique. The username you chose is already in use.'
            )
            return sendBadRequestResponse(res, 'auth/signup', ...errorMessages)
          }
          errorMessages.push(error.message)

          return res.status(500).render('auth/signup', { errorMessages })
        })
    })
  }
)

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

const sendBadRequestResponse = (res, view, ...errorMessages) => {
  return res.status(400).render(view, {
    errorMessages,
  })
}

router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body
  const errorMessages = []

  if (!username) {
    errorMessages.push('Please provide your username.')
  }

  if (password.length < 8) {
    errorMessages.push('Your password needs to be at least 8 characters long.')
  }

  if (errorMessages.length > 0) {
    return sendBadRequestResponse(res, 'auth/login', ...errorMessages)
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return sendBadRequestResponse(res, 'auth/login', 'Wrong credentials.')
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return sendBadRequestResponse(res, 'auth/login', 'Wrong credentials.')
        }
        req.session.user = user
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect('/')
      })
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err)
      // return res.status(500).render("login", { errorMessages: [err.message] });
    })
})

router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render('auth/logout', { errorMessages: [err.message] })
    }
    res.redirect('/')
  })
})

module.exports = router
