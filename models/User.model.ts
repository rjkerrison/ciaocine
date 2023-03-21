import { InferSchemaType, SchemaTypes, Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    username: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
      select: false,
      minlength: 8,
    },
    profilePictureUrl: {
      type: SchemaTypes.String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const User = model('User', userSchema)

export type UserSchema = InferSchemaType<typeof userSchema>

export default User
