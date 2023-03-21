import { JsonWebKey } from 'crypto'
import { HydratedDocument } from 'mongoose'
import { MovieSchema } from './models/Movie.model'
import { PointSchema } from './models/schemas/geolocation'

declare global {
  namespace Express {
    interface Request {
      movie: HydratedDocument<MovieSchema>
      user: UserSchema
      payload: { username: string }
      geolocation: PointSchema
    }
  }
}
