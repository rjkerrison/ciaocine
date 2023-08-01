import { JsonWebKey } from 'crypto'
import { MovieSchema } from './models/Movie.model'
import { PointSchema } from './models/schemas/geolocation'
import { UserSchema } from './models/User.model'
import { HydratedDocument } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      movie: HydratedDocument<MovieSchema>
      user: HydratedDocument<UserSchema>
      payload: { username: string }
      geolocation: PointSchema
    }
  }
}
