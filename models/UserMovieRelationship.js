const { Schema, model, SchemaTypes } = require('mongoose')

const userMovieRelationshipSchema = new Schema(
  {
    cinema: { type: Schema.Types.ObjectId, ref: 'Cinema' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

const UserMovieRelationship = model(
  'UserMovieRelationship',
  userMovieRelationshipSchema
)

const watchSchema = new Schema({
  rating: {
    type: SchemaTypes.Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
})

const wantSchema = new Schema({})
const dismissSchema = new Schema({})

const Watch = UserMovieRelationship.discriminator('Watch', watchSchema)
const Want = UserMovieRelationship.discriminator('Want', wantSchema)
const Dismiss = UserMovieRelationship.discriminator('Dismiss', dismissSchema)

export { Watch, Want, Dismiss }
