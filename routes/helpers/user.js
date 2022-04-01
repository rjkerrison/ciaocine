const bcrypt = require('bcrypt')
const User = require('../../models/User.model')
const saltRounds = 10

const createUser = async ({ username, profilePictureUrl, password }) => {
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    username,
    profilePictureUrl,
    password: hashedPassword,
  })
  return user
}

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i

const validateUserInputs = function* ({ username, email, password }) {
  if (!username || typeof username !== 'string' || username.length < 4) {
    yield 'Username must be a string of at least 4 characters.'
  }

  if (
    !email ||
    typeof email !== 'string' ||
    email.length < 5 ||
    !emailRegex.test(email)
  ) {
    yield 'Invalid email format.'
  }

  if (password.length < 8) {
    yield 'Password must be at least 8 characters long.'
  }
}

module.exports = {
  createUser,
  validateUserInputs,
}
