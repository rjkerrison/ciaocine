export interface SessionByFilmAndCinema {
  film: Mk2Film
  cinema: Mk2Cinema
  sessions: Mk2Session[]
}

export interface Mk2Film {
  slug: string
  title: string
  id: string
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
