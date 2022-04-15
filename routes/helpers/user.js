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

module.exports = {
  createUser,
}
