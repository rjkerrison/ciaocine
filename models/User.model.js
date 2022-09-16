const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      select: false,
      minlength: 8,
    },
    profilePictureUrl: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const User = model('User', userSchema)

module.exports = User
