export interface SessionByFilmAndCinema {
  film: Mk2Film
  cinema: Mk2Cinema
  sessions: Mk2Session[]
}

export interface Mk2Cast
  extends Array<{
    firstName: string
    lastName: string
    personType: CastPersonType
  }> {}

export type CastPersonType = 'Actor' | 'Director' | 'Producer'

export interface Mk2Film {
  slug: string
  title: string
  id: string
  synopsis: string
  hoFilmCode: string
  runTime: 98
  openingDate: Date
  graphicUrl: string
  backdropUrl: string
  trailerUrl: string
  hasSessionsAvailable: true
  rating: {
    name: string
    description: string
    formattedDescription: string
    icon: string
  }
  genres: Array<{
    id: string
    name: string
  }>
  twitterTag: string
  distributorName: string
  governmentCode: string
  cast: Mk2Cast
  type: {
    id: string
    name: string
    color: string
  }
  areasOfInterest: []
  selections: Array<{
    id: string
    name: string
    label: true
    color: string
  }>
  label: {
    id: string
    name: string
    label: true
    color: string
  }
  nextSessionDate: Date
}

export interface Mk2Session {
  showTime: string
  mk2ShowtimeId: string
}

export interface Mk2Complex {
  slug: string
  cinemas: Mk2Cinema[]
}

export interface Mk2CinemaComplex {
  cinema: Mk2Cinema
  complexSlug: string
}

export interface Mk2Cinema {
  slug: string
  ciaocineSlug?: string
}

export interface FilmSessions {
  type: { id: 'film'; name: 'Film' }
  sessionsByFilmAndCinema: Array<SessionByFilmAndCinema>
}

export interface SessionsByType extends Array<FilmSessions> {}
