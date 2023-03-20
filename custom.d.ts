import { MovieSchema } from './models/Movie.model'

declare global {
  namespace Express {
    interface Request {
      movie: MovieSchema
    }
  }
}
