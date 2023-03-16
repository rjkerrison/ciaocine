import info from './mk2-info.json'

interface Mk2Complex {
  slug: string
  cinemas: Mk2Cinema[]
}

interface Mk2CinemaComplex {
  cinema: Mk2Cinema
  complexSlug: string
}

export interface Mk2Cinema {
  slug: string
  ciaocineSlug?: string
}

const mk2complexes: Mk2Complex[] = info.complexes

const matchesSlug = (cinema: Mk2Cinema, slug: string) => {
  return cinema.slug === slug || cinema.ciaocineSlug === slug
}

export const findComplexForCinema = (slug: string): Mk2Complex | undefined => {
  const complex = mk2complexes.find((complex) =>
    complex.cinemas.some((cinema) => matchesSlug(cinema, slug))
  )

  return complex
}

export const findCinema = (slug: string): Mk2CinemaComplex | undefined => {
  for (const complex of mk2complexes) {
    for (const cinema of complex.cinemas) {
      if (matchesSlug(cinema, slug)) {
        return {
          cinema,
          complexSlug: complex.slug,
        }
      }
    }
  }
}
